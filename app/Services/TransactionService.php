<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use Exception;

class TransactionService
{
    protected $netWorthService;

    public function __construct(NetWorthService $netWorthService)
    {
        $this->netWorthService = $netWorthService;
    }

    /**
     * Cria uma nova transação e atualiza o saldo da conta.
     *
     * @param array $data
     * @return Transaction
     * @throws Exception
     */
    public function createTransaction(array $data)
    {
        return DB::transaction(function () use ($data) {
            $category = \App\Models\Category::findOrFail($data['category_id']);

            // Validação de consistência entre tipo de transação e tipo de categoria
            if ($category->type !== $data['type']) {
                $tipoEsperado = $data['type'] === 'revenue' ? 'Receita' : 'Despesa';
                throw new \Exception("A categoria '{$category->name}' não é do tipo {$tipoEsperado}.");
            }

            $transaction = Transaction::create($data);
            $this->updateAccountBalance($transaction->account, $transaction->amount, $transaction->type);
            
            // Atualiza o património do utilizador após a transação
            $this->netWorthService->syncNetWorth($transaction->account->user);

            return $transaction;
        });
    }

    /**
     * Atualiza uma transação existente e ajusta os saldos das contas.
     *
     * @param Transaction $transaction
     * @param array $data
     * @return Transaction
     * @throws Exception
     */
    public function updateTransaction(Transaction $transaction, array $data)
    {
        return DB::transaction(function () use ($transaction, $data) {
            // Reverte o impacto da transação antiga no saldo
            $this->reverseAccountBalance($transaction);

            // Atualiza os dados da transação
            // Se houver nova categoria ou novo tipo, valida a consistência
            $novaCategoriaId = $data['category_id'] ?? $transaction->category_id;
            $novoTipo = $data['type'] ?? $transaction->type;
            
            $category = \App\Models\Category::findOrFail($novaCategoriaId);
            if ($category->type !== $novoTipo) {
                $tipoEsperado = $novoTipo === 'revenue' ? 'Receita' : 'Despesa';
                throw new \Exception("A categoria '{$category->name}' não é do tipo {$tipoEsperado}.");
            }

            $transaction->update($data);

            // Aplica o novo impacto no saldo
            $this->updateAccountBalance($transaction->account, $transaction->amount, $transaction->type);

            // Atualiza o património do utilizador após a atualização
            $this->netWorthService->syncNetWorth($transaction->account->user);

            return $transaction;
        });
    }

    /**
     * Remove uma transação e reverte o saldo da conta.
     *
     * @param Transaction $transaction
     * @return bool
     * @throws Exception
     */
    public function deleteTransaction(Transaction $transaction)
    {
        return DB::transaction(function () use ($transaction) {
            $user = $transaction->account->user;
            $this->reverseAccountBalance($transaction);
            $deleted = $transaction->delete();
            
            // Atualiza o património do utilizador após eliminar
            $this->netWorthService->syncNetWorth($user);

            return $deleted;
        });
    }

    /**
     * Atualiza o saldo da conta baseado no tipo de transação.
     *
     * @param Account $account
     * @param float $amount
     * @param string $type
     * @throws Exception
     */
    private function updateAccountBalance(Account $account, $amount, $type)
    {
        if ($type === 'revenue') {
            $account->balance += $amount;
        } else {
            // Verifica se há saldo suficiente para a despesa
            if ($account->balance < $amount) {
                throw new Exception("Saldo insuficiente na conta '{$account->name}' para realizar esta despesa.");
            }
            $account->balance -= $amount;
        }
        $account->save();
    }

    /**
     * Reverte o impacto de uma transação no saldo da conta.
     *
     * @param Transaction $transaction
     * @throws Exception
     */
    private function reverseAccountBalance(Transaction $transaction)
    {
        $account = $transaction->account;
        if ($transaction->type === 'revenue') {
            // Ao reverter uma receita, verifica se a conta não ficará negativa
            if ($account->balance < $transaction->amount) {
                throw new Exception("Não é possível reverter/eliminar esta receita pois o saldo da conta ficaria negativo.");
            }
            $account->balance -= $transaction->amount;
        } else {
            $account->balance += $transaction->amount;
        }
        $account->save();
    }
}

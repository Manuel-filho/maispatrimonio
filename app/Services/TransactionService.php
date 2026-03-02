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
            $account = Account::findOrFail($data['account_id']);
            $category = \App\Models\Category::findOrFail($data['category_id']);

            // REGRA: Apenas contas de LIQUIDEZ podem ter receitas/despesas diretas.
            // Ativos e Investimentos são património imobilizado e não devem ser "gastos" diretamente.
            $liquidityTypes = ['conta_corrente', 'poupanca', 'corrente', 'cash'];
            if (!in_array($account->type, $liquidityTypes)) {
                throw new Exception("Não é possível registar receitas ou despesas diretamente em contas de '{$account->type}'. Ativos imobilizados não devem ser afetados por fluxos de caixa diretos.");
            }

            // Validação de consistência entre tipo de transação e tipo de categoria
            if ($category->type !== $data['type']) {
                $tipoEsperado = $data['type'] === 'revenue' ? 'Receita' : 'Despesa';
                throw new Exception("A categoria '{$category->name}' não é do tipo {$tipoEsperado}.");
            }

            $transaction = Transaction::create($data);
            $this->updateAccountBalance($account, $transaction->amount, $transaction->type);
            
            // Sincroniza histórico e património
            $this->syncHistory($account->user);
            $this->netWorthService->syncNetWorth($account->user);

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

            // Se houver nova conta, nova categoria ou novo tipo, valida a consistência
            $novaContaId = $data['account_id'] ?? $transaction->account_id;
            $novaCategoriaId = $data['category_id'] ?? $transaction->category_id;
            $novoTipo = $data['type'] ?? $transaction->type;
            
            $account = Account::findOrFail($novaContaId);
            $category = \App\Models\Category::findOrFail($novaCategoriaId);

            // REGRA: Apenas contas de LIQUIDEZ
            $liquidityTypes = ['conta_corrente', 'poupanca', 'corrente', 'cash'];
            if (!in_array($account->type, $liquidityTypes)) {
                throw new Exception("Não é possível atualizar para uma conta de '{$account->type}'. Ativos imobilizados não devem ser afetados por fluxos de caixa diretos.");
            }

            if ($category->type !== $novoTipo) {
                $tipoEsperado = $novoTipo === 'revenue' ? 'Receita' : 'Despesa';
                throw new Exception("A categoria '{$category->name}' não é do tipo {$tipoEsperado}.");
            }

            $transaction->update($data);

            // Re-valida saldo na nova conta (ou mesma conta com novo valor)
            $this->updateAccountBalance($account, $transaction->amount, $transaction->type);

            // Sincroniza histórico e património
            $this->syncHistory($account->user);
            $this->netWorthService->syncNetWorth($account->user);

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
            
            // Sincroniza histórico e património
            $this->syncHistory($user);
            $this->netWorthService->syncNetWorth($user);

            return $deleted;
        });
    }
    /**
     * Realiza uma transferência entre contas e cria registos de transação.
     *
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function transfer(array $data)
    {
        return DB::transaction(function () use ($data) {
            $fromAccount = Account::findOrFail($data['from_account_id']);
            $toAccount = Account::findOrFail($data['to_account_id']);
            $amount = $data['amount'];
            $date = $data['date'] ?? now();

            if ($fromAccount->id === $toAccount->id) {
                throw new Exception("A conta de origem e destino não podem ser a mesma.");
            }

            // REGRA: Transferências de/para Ativos? 
            // O utilizador disse: "PATRIMONO(ATIVO) NÃO DEVEM AFETAR RECEITA... ATÉ PODE AFECTAR TRANSFERENCIAS PORQUE VC PODE VERNDER A COISA"
            // Então permitimos transferências, mas a de saída do ativo deve ser tratada com cuidado.
            // No entanto, a regra de SALDO NEGATIVO é absoluta para LIQUIDEZ.
            if ($fromAccount->balance < $amount) {
                throw new Exception("Saldo insuficiente na conta '{$fromAccount->name}' para realizar a transferência. Dados negativos não são permitidos.");
            }

            // Encontrar uma categoria de transferência ou criar uma genérica
            $category = \App\Models\Category::where('user_id', $fromAccount->user_id)
                ->where('name', 'Transferência')
                ->first();

            if (!$category) {
                $category = \App\Models\Category::create([
                    'user_id' => $fromAccount->user_id,
                    'name' => 'Transferência',
                    'icon' => 'exchange-alt',
                    'color' => '#6366f1',
                    'type' => 'expense' // Usamos despesa por padrão para a origem
                ]);
            }

            // Criar Transação de Saída (Origem)
            $outTransaction = Transaction::create([
                'account_id' => $fromAccount->id,
                'category_id' => $category->id,
                'description' => "Transferência para {$toAccount->name}",
                'amount' => $amount,
                'type' => 'expense',
                'date' => $date
            ]);

            // Criar Transação de Entrada (Destino)
            $inTransaction = Transaction::create([
                'account_id' => $toAccount->id,
                'category_id' => $category->id,
                'description' => "Transferência de {$fromAccount->name}",
                'amount' => $amount,
                'type' => 'revenue',
                'date' => $date,
                'parent_transaction_id' => $outTransaction->id
            ]);

            // Atualizar saldos
            $fromAccount->balance -= $amount;
            $fromAccount->save();

            $toAccount->balance += $amount;
            $toAccount->save();

            $this->syncHistory($fromAccount->user);
            $this->netWorthService->syncNetWorth($fromAccount->user);

            return [
                'out' => $outTransaction,
                'in' => $inTransaction
            ];
        });
    }

    /**
     * Anula uma transação se estiver dentro do prazo de 30 minutos.
     *
     * @param Transaction $transaction
     * @return void
     * @throws Exception
     */
    public function cancelTransaction(Transaction $transaction)
    {
        return DB::transaction(function () use ($transaction) {
            if ($transaction->cancelled_at) {
                throw new Exception("Esta transação já foi anulada.");
            }

            $minutesSinceCreation = now()->diffInMinutes($transaction->created_at);
            if ($minutesSinceCreation > 30) {
                throw new Exception("O prazo de 30 minutos para anular esta transação já expirou.");
            }

            // Se for parte de uma transferência (perna principal ou secundária)
            $transactionsToCancel = collect([$transaction]);
            
            // Se for a perna principal (saída)
            $children = Transaction::where('parent_transaction_id', $transaction->id)->get();
            $transactionsToCancel = $transactionsToCancel->concat($children);

            // Se for a perna secundária (entrada)
            if ($transaction->parent_transaction_id) {
                $parent = Transaction::find($transaction->parent_transaction_id);
                if ($parent) {
                    $transactionsToCancel->push($parent);
                }
            }

            foreach ($transactionsToCancel as $t) {
                if ($t->cancelled_at) continue;
                
                $this->reverseAccountBalance($t);
                $t->update(['cancelled_at' => now()]);
            }

            $this->syncHistory($transaction->account->user);
            $this->netWorthService->syncNetWorth($transaction->account->user);
        });
    }

    /**
     * Sincroniza o histórico financeiro diário do utilizador.
     *
     * @param \App\Models\User $user
     * @return void
     */
    public function syncHistory($user)
    {
        \App\Models\FinancialHistory::updateOrCreate(
            [
                'user_id' => $user->id,
                'date' => now()->toDateString(),
            ],
            [
                'liquidity' => $user->liquidity,
                'assets_value' => $user->assets_value,
                'net_worth' => $user->total_net_worth,
            ]
        );
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

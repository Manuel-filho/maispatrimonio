<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Account;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Lista todas as transações do utilizador autenticado.
     */
    public function index()
    {
        // Obtém todas as transações através das contas do utilizador
        $transactions = Transaction::whereIn('account_id', Auth::user()->accounts->pluck('id'))
            ->with(['account', 'category'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($transactions);
    }

    /**
     * Armazena uma nova transação.
     */
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'type' => 'required|in:revenue,expense',
            'date' => 'required|date',
        ]);

        // Verifica se a conta pertence ao utilizador
        $account = Account::findOrFail($request->account_id);
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Conta não autorizada'], 403);
        }

        try {
            $transaction = $this->transactionService->createTransaction($request->all());
            return response()->json($transaction, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Exibe os detalhes de uma transação específica.
     */
    public function show(Transaction $transaction)
    {
        if ($transaction->account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return response()->json($transaction->load(['account', 'category']));
    }

    /**
     * Atualiza uma transação específica.
     */
    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $request->validate([
            'account_id' => 'sometimes|required|exists:accounts,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric',
            'type' => 'sometimes|required|in:revenue,expense',
            'date' => 'sometimes|required|date',
        ]);

        // Se mudar a conta, verifica se a nova conta pertence ao utilizador
        if ($request->has('account_id')) {
            $account = Account::findOrFail($request->account_id);
            if ($account->user_id !== Auth::id()) {
                return response()->json(['message' => 'Nova conta não autorizada'], 403);
            }
        }

        try {
            $transaction = $this->transactionService->updateTransaction($transaction, $request->all());
            return response()->json($transaction);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Remove uma transação específica.
     */
    public function destroy(Transaction $transaction)
    {
        if ($transaction->account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        try {
            $this->transactionService->deleteTransaction($transaction);
            return response()->json(['message' => 'Transação eliminada com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}

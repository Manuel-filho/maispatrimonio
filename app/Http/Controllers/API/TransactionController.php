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

    /**
     * Anula uma transação se estiver dentro do prazo.
     */
    public function cancel(Transaction $transaction)
    {
        if ($transaction->account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        try {
            $this->transactionService->cancelTransaction($transaction);
            return response()->json(['message' => 'Transação anulada com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Obtém o histórico financeiro (liquidez e ativos).
     */
    public function history(Request $request)
    {
        $days = $request->query('days', 30);
        $history = \App\Models\FinancialHistory::where('user_id', Auth::id())
            ->where('date', '>=', now()->subDays($days)->toDateString())
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($history);
    }

    /**
     * Obtém estatísticas consolidadas por categoria.
     */
    public function stats(Request $request)
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());

        // Filtrar apenas contas de LIQUIDEZ (Corrente, Poupança, Dinheiro)
        // Ativos e Investimentos não devem afetar o fluxo de caixa direto
        $liquidityAccountIds = Auth::user()->accounts()
            ->whereIn('type', ['conta_corrente', 'poupanca', 'corrente', 'cash'])
            ->pluck('id');

        $transactionsQuery = Transaction::whereIn('account_id', $liquidityAccountIds)
            ->whereNull('cancelled_at')
            ->whereBetween('date', [$startDate, $endDate]);

        // Agrupar por categorias (apenas liquidez)
        $stats = (clone $transactionsQuery)
            ->selectRaw('category_id, type, SUM(amount) as total')
            ->groupBy('category_id', 'type')
            ->with('category')
            ->get();

        $totals = (clone $transactionsQuery)
            ->selectRaw('type, SUM(amount) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $totalRevenue = (float)($totals['revenue'] ?? 0);
        $totalExpense = (float)($totals['expense'] ?? 0);
        $netFlow = $totalRevenue - $totalExpense;

        // Processar categorias: ordenar por valor e calcular percentagem
        $processedCategories = $stats->map(function ($stat) use ($totalRevenue, $totalExpense) {
            $totalForType = $stat->type === 'revenue' ? $totalRevenue : $totalExpense;
            return [
                'category_id' => $stat->category_id,
                'type' => $stat->type,
                'total' => (float)$stat->total,
                'category' => $stat->category,
                'percentage' => $totalForType > 0 ? round(($stat->total / $totalForType) * 100, 2) : 0
            ];
        })->sortByDesc('total')->values();

        // Dados passivos para o frontend (evitar lógica e números negativos)
        return response()->json([
            'categories' => $processedCategories,
            'total_revenue' => $totalRevenue,
            'total_expense' => $totalExpense,
            'net_flow' => abs($netFlow),
            'net_flow_status' => $netFlow >= 0 ? 'surplus' : 'deficit',
            'net_flow_label' => $netFlow >= 0 ? 'Equilíbrio Líquido' : 'Défice do Período',
            'period_summary' => [
                'start' => $startDate,
                'end' => $endDate,
                'is_positive' => $netFlow >= 0
            ]
        ]);
    }
}

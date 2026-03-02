<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    /**
     * Lista todas as contas do utilizador autenticado.
     */
    public function index()
    {
        $accounts = Auth::user()->accounts;
        return response()->json($accounts);
    }

    /**
     * Armazena uma nova conta para o utilizador autenticado.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'balance' => 'required|numeric',
            'currency_id' => 'nullable|exists:currencies,id',
        ]);

        $data = $request->all();

        // Se não for enviada moeda, usa a preferida do utilizador
        if (!$request->has('currency_id') || empty($request->currency_id)) {
            $data['currency_id'] = Auth::user()->preferred_currency_id;
        } else {
            // Verifica se a moeda pertence ao utilizador
            $currency = \App\Models\Currency::find($request->currency_id);
            if (!$currency || $currency->user_id !== Auth::id()) {
                return response()->json(['message' => 'Moeda não autorizada ou inexistente'], 403);
            }
        }

        $account = Auth::user()->accounts()->create($data);

        return response()->json($account->load('currency'), 201);
    }

    /**
     * Exibe os detalhes de uma conta específica.
     */
    public function show(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return response()->json($account);
    }

    /**
     * Atualiza uma conta específica.
     */
    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string',
            'balance' => 'sometimes|required|numeric',
        ]);

        $account->update($request->all());

        return response()->json($account);
    }

    /**
     * Remove uma conta específica.
     */
    public function destroy(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $account->delete();

        return response()->json(['message' => 'Conta eliminada com sucesso']);
    }
}

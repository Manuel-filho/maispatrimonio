<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurrencyController extends Controller
{
    /**
     * Lista todas as moedas do utilizador.
     */
    public function index()
    {
        return response()->json(Auth::user()->currencies);
    }

    /**
     * Cria uma nova moeda.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10',
            'symbol' => 'required|string|max:10',
        ]);

        $currency = Auth::user()->currencies()->create($request->all());

        return response()->json($currency, 201);
    }

    /**
     * Exibe os detalhes de uma moeda.
     */
    public function show(Currency $currency)
    {
        if ($currency->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return response()->json($currency);
    }

    /**
     * Atualiza uma moeda.
     */
    public function update(Request $request, Currency $currency)
    {
        if ($currency->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:10',
            'symbol' => 'sometimes|required|string|max:10',
        ]);

        $currency->update($request->all());

        return response()->json($currency);
    }

    /**
     * Remove uma moeda.
     */
    public function destroy(Currency $currency)
    {
        if ($currency->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        // Verifica se a moeda não é a preferida ou se está em uso por alguma conta
        if (Auth::user()->preferred_currency_id === $currency->id) {
            return response()->json(['message' => 'Não é possível eliminar a sua moeda preferida'], 422);
        }

        if ($currency->accounts()->exists()) {
            return response()->json(['message' => 'Não é possível eliminar uma moeda associada a contas existentes'], 422);
        }

        $currency->delete();

        return response()->json(['message' => 'Moeda eliminada com sucesso']);
    }

    /**
     * Define uma moeda como a preferida do utilizador.
     */
    public function setPreferred(Currency $currency)
    {
        if ($currency->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        Auth::user()->update(['preferred_currency_id' => $currency->id]);

        return response()->json(['message' => 'Moeda preferida atualizada com sucesso']);
    }
}

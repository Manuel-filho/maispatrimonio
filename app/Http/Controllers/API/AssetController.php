<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Services\NetWorthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssetController extends Controller
{
    protected $netWorthService;

    public function __construct(NetWorthService $netWorthService)
    {
        $this->netWorthService = $netWorthService;
    }

    /**
     * Lista todos os ativos do utilizador.
     */
    public function index()
    {
        return response()->json(Auth::user()->assets()->with('currency')->get());
    }

    /**
     * Cria um novo ativo.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'estimated_value' => 'required|numeric|min:0',
            'currency_id' => 'required|exists:currencies,id',
        ]);

        // Verifica se a moeda pertence ao utilizador
        $currency = \App\Models\Currency::find($request->currency_id);
        if ($currency->user_id !== Auth::id()) {
            return response()->json(['message' => 'Moeda não autorizada'], 403);
        }

        $asset = Auth::user()->assets()->create($request->all());

        // Atualiza o recorde de património
        $this->netWorthService->syncNetWorth(Auth::user());

        return response()->json($asset->load('currency'), 201);
    }

    /**
     * Exibe os detalhes de um ativo.
     */
    public function show(Asset $asset)
    {
        if ($asset->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return response()->json($asset->load('currency'));
    }

    /**
     * Atualiza um ativo.
     */
    public function update(Request $request, Asset $asset)
    {
        if ($asset->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string',
            'estimated_value' => 'sometimes|required|numeric|min:0',
            'currency_id' => 'sometimes|required|exists:currencies,id',
        ]);

        if ($request->has('currency_id')) {
            $currency = \App\Models\Currency::find($request->currency_id);
            if ($currency->user_id !== Auth::id()) {
                return response()->json(['message' => 'Moeda não autorizada'], 403);
            }
        }

        $asset->update($request->all());

        // Atualiza o recorde de património
        $this->netWorthService->syncNetWorth(Auth::user());

        return response()->json($asset->load('currency'));
    }

    /**
     * Remove um ativo.
     */
    public function destroy(Asset $asset)
    {
        if ($asset->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $asset->delete();

        // Atualiza o recorde de património (embora o total caia, o sync mantém integridade)
        $this->netWorthService->syncNetWorth(Auth::user());

        return response()->json(['message' => 'Ativo eliminado com sucesso']);
    }
}

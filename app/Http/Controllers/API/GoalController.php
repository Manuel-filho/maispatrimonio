<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GoalController extends Controller
{
    /**
     * Exibe uma listagem das metas do utilizador.
     */
    public function index()
    {
        $goals = auth()->user()->goals()->orderBy('due_date', 'asc')->get();
        return response()->json($goals);
    }

    /**
     * Armazena uma nova meta.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'required|numeric|min:0.01',
            'current_amount' => 'nullable|numeric|min:0',
            'due_date' => 'required|date',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
        ], [
            'required' => 'Este campo é obrigatório.',
            'numeric' => 'O valor deve ser um número.',
            'date' => 'A data inserida não é válida.',
            'after_or_equal' => 'A data deve ser hoje ou uma data futura.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $goal = auth()->user()->goals()->create($validator->validated());

        return response()->json([
            'message' => 'Meta criada com sucesso!',
            'goal' => $goal
        ], 201);
    }

    /**
     * Exibe a meta específica.
     */
    public function show(Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        return response()->json($goal);
    }

    /**
     * Atualiza a meta específica.
     */
    public function update(Request $request, Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'sometimes|required|numeric|min:0.01',
            'current_amount' => 'nullable|numeric|min:0',
            'due_date' => 'sometimes|required|date',
            'status' => 'nullable|string|in:em_progresso,concluida,cancelada',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
        ], [
            'required' => 'Este campo é obrigatório.',
            'numeric' => 'O valor deve ser um número.',
            'date' => 'A data inserida não é válida.',
            'in' => 'O status selecionado é inválido.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $goal->update($validator->validated());

        return response()->json([
            'message' => 'Meta atualizada com sucesso!',
            'goal' => $goal
        ]);
    }

    /**
     * Remove a meta específica.
     */
    public function destroy(Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $goal->delete();

        return response()->json(['message' => 'Meta eliminada com sucesso!']);
    }
}

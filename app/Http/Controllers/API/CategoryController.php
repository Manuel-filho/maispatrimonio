<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Lista todas as categorias do utilizador autenticado.
     */
    public function index()
    {
        $categories = Auth::user()->categories;
        return response()->json($categories);
    }

    /**
     * Armazena uma nova categoria para o utilizador autenticado.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:revenue,expense',
            'description' => 'nullable|string',
        ]);

        $category = Auth::user()->categories()->create($request->all());

        return response()->json($category, 201);
    }

    /**
     * Exibe os detalhes de uma categoria específica.
     */
    public function show(Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        return response()->json($category);
    }

    /**
     * Atualiza uma categoria específica.
     */
    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|in:revenue,expense',
            'description' => 'nullable|string',
        ]);

        $category->update($request->all());

        return response()->json($category);
    }

    /**
     * Remove uma categoria específica.
     */
    public function destroy(Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Categoria eliminada com sucesso']);
    }
}

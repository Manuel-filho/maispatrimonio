<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Realiza o login do usuário e retorna um token JWT.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Valida os dados de entrada
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ], [
            'required' => 'Este campo é obrigatório.',
            'email' => 'O formato do e-mail é inválido.',
            'min' => 'A palavra-passe deve ter pelo menos :min caracteres.'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Tenta autenticar o usuário com as credenciais fornecidas
        if (!$token = auth('api')->attempt($validator->validated())) {
            return response()->json(['error' => 'As credenciais fornecidas estão incorretas.'], 401);
        }

        // Retorna o token JWT recém-criado
        return $this->createNewToken($token);
    }

    /**
     * Registra um novo usuário.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Valida os dados de entrada
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'avatar' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'phone' => 'required|string',
            'birthdate' => 'required|date|before_or_equal:-10 years',
            'gender' => 'required|string|in:M,F',
            'net_worth' => 'nullable|numeric',
        ], [
            'required' => 'Este campo é obrigatório.',
            'string' => 'Este campo deve ser um texto válido.',
            'email' => 'O formato do e-mail é inválido.',
            'email.unique' => 'Este e-mail já está associado a uma conta.',
            'min' => 'Deve ter pelo menos :min caracteres.',
            'max' => 'Não pode ter mais de :max caracteres.',
            'between' => 'O nome deve ter entre :min e :max caracteres.',
            'date' => 'A data inserida não é válida.',
            'before_or_equal' => 'Lamentamos, mas deve ter pelo menos 10 anos de idade para se registar.',
            'mimes' => 'O avatar deve ser uma imagem válida.',
            'numeric' => 'O valor deve ser numérico.'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Cria o novo usuário no banco de dados e a moeda padrão (Kwanza)
        $user = \Illuminate\Support\Facades\DB::transaction(function () use ($validator, $request) {
            $validatedData = $validator->validated();

            // Realiza o upload do avatar nativamente para o disco 'public' (storage/app/public/avatars)
            if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
                $path = $request->file('avatar')->store('avatars', 'public');
                $validatedData['avatar'] = url('storage/' . $path);
            }

            $user = User::create(array_merge(
                $validatedData,
                [
                    'password' => bcrypt($request->password),
                ]
            ));

            // Cria a moeda Kwanza para o novo utilizador
            $currency = $user->currencies()->create([
                'name' => 'Kwanza',
                'code' => 'AOA',
                'symbol' => 'Kz',
            ]);

            // Define como moeda preferida
            $user->update(['preferred_currency_id' => $currency->id]);

            return $user;
        });

        return response()->json([
            'message' => 'Usuário registrado com sucesso!',
            'user' => $user->load('preferredCurrency')
        ], 201);
    }

    /**
     * Verifica se um e-mail já existe na base de dados.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkEmail(Request $request)
    {
        // Valida o e-mail fornecido
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:100',
        ], [
            'required' => 'Por favor, insira o seu endereço de e-mail.',
            'email' => 'O formato do e-mail é inválido.'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Busca o usuário pelo e-mail
        $user = User::where('email', $request->email)->first();

        if ($user) {
            return response()->json([
                'status' => 'step_1_complete',
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar
                ]
            ]);
        }

        return response()->json(['error' => 'Não encontrámos nenhuma conta com este e-mail.'], 404);
    }


    /**
     * Realiza o logout do usuário (invalida o token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Logout realizado com sucesso!']);
    }

    /**
     * Atualiza o token do usuário (refresh).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Retorna os dados do usuário autenticado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user()->load('preferredCurrency'));
    }

    /**
     * Atualiza o perfil do utilizador.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
            'birthdate' => 'nullable|date|before_or_equal:today',
            'gender' => 'nullable|string|in:M,F',
            'preferred_currency_id' => 'nullable|exists:currencies,id',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ], [
            'required' => 'Este campo é obrigatório.',
            'email' => 'O formato do e-mail é inválido.',
            'email.unique' => 'Este e-mail já está associado a outra conta.',
            'date' => 'A data inserida não é válida.',
            'mimes' => 'O avatar deve ser uma imagem válida.',
            'exists' => 'A moeda selecionada é inválida.'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = url('storage/' . $path);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Perfil atualizado com sucesso!',
            'user' => $user->fresh()->load('preferredCurrency')
        ]);
    }

    /**
     * Altera a palavra-passe do utilizador.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ], [
            'required' => 'Este campo é obrigatório.',
            'min' => 'A nova palavra-passe deve ter pelo menos :min caracteres.',
            'confirmed' => 'A confirmação da palavra-passe não coincide.'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'current_password' => ['A palavra-passe atual está incorreta.']
            ], 422);
        }

        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Palavra-passe alterada com sucesso!'
        ]);
    }

    /**
     * Elimina permanentemente a conta do utilizador autenticado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy()
    {
        $user = auth()->user();

        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($user) {
                // Elimina dados relacionados (contas, categorias, metas, ativos, etc.)
                // Assumindo que as relações no modelo têm onDelete('cascade')
                // Caso contrário, eliminamos manualmente aqui.
                
                $user->accounts()->each(function($account) {
                    $account->transactions()->delete();
                    $account->delete();
                });
                
                $user->categories()->delete();
                $user->goals()->delete();
                $user->assets()->delete();
                $user->currencies()->delete();
                
                $user->delete();
            });

            return response()->json(['message' => 'Conta eliminada com sucesso.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao eliminar conta: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Retorna a estrutura de dados do token.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }
}

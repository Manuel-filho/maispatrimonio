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
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Tenta autenticar o usuário com as credenciais fornecidas
        if (!$token = auth('api')->attempt($validator->validated())) {
            return response()->json(['error' => 'Não autorizado'], 401);
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
            'phone' => 'nullable|string',
            'birthdate' => 'required|date',
            'gender' => 'required|string',
            'net_worth' => 'nullable|numeric',
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
                ['password' => bcrypt($request->password)]
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

        return response()->json('manteiga', 404);
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
        return response()->json(auth()->user());
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

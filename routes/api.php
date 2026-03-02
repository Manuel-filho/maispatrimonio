<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\AccountController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\CurrencyController;
use App\Http\Controllers\API\AssetController;
use App\Http\Controllers\API\GoalController;

/*
|--------------------------------------------------------------------------
| Rotas da API
|--------------------------------------------------------------------------
|
| Aqui é onde você pode registrar as rotas da API para sua aplicação. Essas
| rotas são carregadas pelo RouteServiceProvider e todas elas serão
| atribuídas ao grupo de middleware "api". Crie algo ótimo!
|
|--------------------------------------------------------------------------
*/

Route::group(['prefix' => 'v1'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('register', [AuthController::class, 'register']);
        Route::post('check-email', [AuthController::class, 'checkEmail']);

        Route::group(['middleware' => 'auth:api'], function() {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('refresh', [AuthController::class, 'refresh']);
            Route::get('me', [AuthController::class, 'me']);
            Route::post('profile', [AuthController::class, 'updateProfile']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
            Route::delete('me', [AuthController::class, 'destroy']);
        });
    });

    // Rotas Protegidas (Recursos)
    Route::group(['middleware' => 'auth:api'], function() {
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('accounts', AccountController::class);
        Route::post('transactions/transfer', [TransactionController::class, 'transfer']);
        Route::post('transactions/{transaction}/cancel', [TransactionController::class, 'cancel']);
        Route::get('transactions/history', [TransactionController::class, 'history']);
        Route::get('transactions/stats', [TransactionController::class, 'stats']);
        Route::apiResource('transactions', TransactionController::class);
        Route::apiResource('goals', GoalController::class);
        
        // Moedas
        Route::apiResource('currencies', CurrencyController::class);
        Route::post('currencies/{currency}/set-preferred', [CurrencyController::class, 'setPreferred']);

        // Ativos (Património Imobilizado)
        Route::apiResource('assets', AssetController::class);
    });
});

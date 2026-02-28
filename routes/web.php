<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return redirect('/docs/api');
});

Route::get('/correr-migrations', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return 'Migrações executadas com sucesso: ' . Artisan::output();
    } catch (\Exception $e) {
        return 'Erro ao executar migrações: ' . $e->getMessage();
    }
});

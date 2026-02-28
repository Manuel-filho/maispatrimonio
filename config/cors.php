<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Configuração do Cross-Origin Resource Sharing (CORS)
    |--------------------------------------------------------------------------
    |
    | Aqui você pode configurar as definições para o compartilhamento de recursos de origem cruzada
    | ou "CORS". Isso determina quais operações de origem cruzada podem ser executadas
    | em navegadores da web. Você é livre para ajustar essas configurações conforme necessário.
    |
    | Para saber mais: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];

<?php

/*
 * Este arquivo faz parte do jwt-auth.
 *
 * (c) Sean Tymon <tymon148@gmail.com>
 *
 * Para informações completas de copyright e licença, por favor veja o arquivo LICENSE
 * que foi distribuído com este código fonte.
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Segredo de Autenticação JWT
    |--------------------------------------------------------------------------
    |
    | Não se esqueça de definir isso no seu arquivo .env, pois será usado para assinar
    | seus tokens. Um comando de ajuda é fornecido para isso:
    | `php artisan jwt:secret`
    |
    | Nota: Isso será usado apenas para algoritmos Simétricos (HMAC),
    | já que RSA e ECDSA usam uma combinação de chave privada/pública (Veja abaixo).
    |
    */

    'secret' => env('JWT_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | Chaves de Autenticação JWT
    |--------------------------------------------------------------------------
    |
    | O algoritmo que você está usando determinará se seus tokens são
    | assinados com uma string aleatória (definida em `JWT_SECRET`) ou usando as
    | seguintes chaves pública e privada.
    |
    | Algoritmos Simétricos:
    | HS256, HS384 & HS512 usarão `JWT_SECRET`.
    |
    | Algoritmos Assimétricos:
    | RS256, RS384 & RS512 / ES256, ES384 & ES512 usarão as chaves abaixo.
    |
    */

    'keys' => [

        /*
        |--------------------------------------------------------------------------
        | Chave Pública
        |--------------------------------------------------------------------------
        |
        | Um caminho ou recurso para sua chave pública.
        |
        | Ex: 'file://caminho/para/chave/publica.pem'
        |
        */

        'public' => env('JWT_PUBLIC_KEY'),

        /*
        |--------------------------------------------------------------------------
        | Chave Privada
        |--------------------------------------------------------------------------
        |
        | Um caminho ou recurso para sua chave privada.
        |
        | Ex: 'file://caminho/para/chave/privada.pem'
        |
        */

        'private' => env('JWT_PRIVATE_KEY'),

        /*
        |--------------------------------------------------------------------------
        | Senha da Chave (Passphrase)
        |--------------------------------------------------------------------------
        |
        | A senha para sua chave privada. Pode ser nulo se nenhuma for definida.
        |
        */

        'passphrase' => env('JWT_PASSPHRASE'),

    ],

    /*
    |--------------------------------------------------------------------------
    | Tempo de vida do JWT (TTL)
    |--------------------------------------------------------------------------
    |
    | Especifique o tempo (em minutos) que o token será válido.
    | O padrão é 1 hora (60 minutos).
    |
    | Você também pode definir como nulo, para gerar um token que nunca expira.
    | Algumas pessoas podem querer esse comportamento para, por exemplo, um aplicativo móvel.
    | Isso não é particularmente recomendado, então certifique-se de ter
    | sistemas apropriados para revogar o token, se necessário.
    | Aviso: Se você definir como nulo, deve remover o elemento 'exp' da lista 'required_claims'.
    |
    */

    'ttl' => env('JWT_TTL', 60),

    /*
    |--------------------------------------------------------------------------
    | Tempo de vida para atualização (Refresh TTL)
    |--------------------------------------------------------------------------
    |
    | Especifique o tempo (em minutos) dentro do qual o token pode ser atualizado.
    | Ou seja, o usuário pode atualizar seu token dentro de uma janela de 2 semanas
    | a partir da criação do token original, até que ele precise se autenticar novamente.
    | O padrão é 2 semanas.
    |
    | Você também pode definir como nulo, para ter um tempo de atualização infinito.
    | Alguns podem preferir isso em vez de tokens que nunca expiram, por exemplo, para um aplicativo móvel.
    | Isso não é particularmente recomendado, então certifique-se de ter
    | sistemas apropriados para revogar o token, se necessário.
    |
    */

    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),

    /*
    |--------------------------------------------------------------------------
    | Algoritmo de Hashing do JWT
    |--------------------------------------------------------------------------
    |
    | Especifique o algoritmo de hashing que será usado para assinar o token.
    |
    */

    'algo' => env('JWT_ALGO', 'HS256'),

    /*
    |--------------------------------------------------------------------------
    | Claims Obrigatórias
    |--------------------------------------------------------------------------
    |
    | Especifique as "claims" (reivindicações) obrigatórias que devem existir em qualquer token.
    | Uma exceção TokenInvalidException será lançada se alguma dessas claims não
    | estiver presente no payload (dados do token).
    |
    */

    'required_claims' => [
        'iss', // Emissor do token
        'iat', // Hora em que o token foi emitido
        'exp', // Hora de expiração do token
        'nbf', // Não antes de (o token não é válido antes deste tempo)
        'sub', // Assunto (identificador do usuário)
        'jti', // ID do JWT (identificador único do token)
    ],

    /*
    |--------------------------------------------------------------------------
    | Claims Persistentes
    |--------------------------------------------------------------------------
    |
    | Especifique as chaves das "claims" a serem mantidas ao atualizar um token.
    | `sub` e `iat` serão automaticamente mantidas, além destas claims.
    |
    | Nota: Se uma claim não existir, ela será ignorada.
    |
    */

    'persistent_claims' => [
        // 'foo',
        // 'bar',
    ],

    /*
    |--------------------------------------------------------------------------
    | Bloquear Assunto (Lock Subject)
    |--------------------------------------------------------------------------
    |
    | Isso determinará se uma claim `prv` será adicionada automaticamente ao
    | token. O objetivo disso é garantir que, se você tiver múltiplos
    | modelos de autenticação (ex: `App\User` e `App\Admin`), devemos
    | impedir que uma requisição de autenticação se passe por outra,
    | caso 2 tokens tenham o mesmo id nos 2 modelos diferentes.
    |
    | Em circunstâncias específicas, você pode querer desativar este comportamento
    | por exemplo, se você tiver apenas um modelo de autenticação, economizando
    | um pouco no tamanho do token.
    |
    */

    'lock_subject' => true,

    /*
    |--------------------------------------------------------------------------
    | Margem de Tolerância (Leeway)
    |--------------------------------------------------------------------------
    |
    | Esta propriedade dá às claims de timestamp do JWT uma certa "margem de tolerância".
    | Isso significa que, se você tiver alguma pequena e inevitável diferença de relógio
    | em qualquer um dos seus servidores, isso lhe dará um certo nível de proteção.
    |
    | Isso se aplica às claims `iat`, `nbf` e `exp`.
    |
    | Especifique em segundos - apenas se você souber que precisa.
    |
    */

    'leeway' => env('JWT_LEEWAY', 0),

    /*
    |--------------------------------------------------------------------------
    | Lista Negra (Blacklist) Ativada
    |--------------------------------------------------------------------------
    |
    | Para invalidar tokens, você deve ter a lista negra ativada.
    | Se você não quer ou não precisa dessa funcionalidade, defina como false.
    |
    */

    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
    
    /*
    | -------------------------------------------------------------------------
    | Período de Carência da Lista Negra (Blacklist Grace Period)
    | -------------------------------------------------------------------------
    |
    | Quando múltiplas requisições concorrentes são feitas com o mesmo JWT,
    | é possível que algumas delas falhem, devido à regeneração do token
    | a cada requisição.
    |
    | Defina um período de carência em segundos para evitar falhas em requisições paralelas.
    |
    */

    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),

    /*
    |--------------------------------------------------------------------------
    | Criptografia de Cookies
    |--------------------------------------------------------------------------
    |
    | Por padrão, o Laravel criptografa cookies por razões de segurança.
    | Se você decidir não descriptografar os cookies, terá que configurar o Laravel
    | para não criptografar seu token de cookie, adicionando o nome dele ao array $except
    | disponível no middleware "EncryptCookies" fornecido pelo Laravel.
    | Veja https://laravel.com/docs/master/responses#cookies-and-encryption
    | para detalhes.
    |
    | Defina como true se quiser descriptografar os cookies.
    |
    */

    'decrypt_cookies' => false,

    /*
    |--------------------------------------------------------------------------
    | Provedores (Providers)
    |--------------------------------------------------------------------------
    |
    | Especifique os vários provedores usados em todo o pacote.
    |
    */

    'providers' => [

        /*
        |--------------------------------------------------------------------------
        | Provedor JWT
        |--------------------------------------------------------------------------
        |
        | Especifique o provedor que é usado para criar e decodificar os tokens.
        |
        */

        'jwt' => Tymon\JWTAuth\Providers\JWT\Lcobucci::class,

        /*
        |--------------------------------------------------------------------------
        | Provedor de Autenticação
        |--------------------------------------------------------------------------
        |
        | Especifique o provedor que é usado para autenticar os usuários.
        |
        */

        'auth' => Tymon\JWTAuth\Providers\Auth\Illuminate::class,

        /*
        |--------------------------------------------------------------------------
        | Provedor de Armazenamento (Storage)
        |--------------------------------------------------------------------------
        |
        | Especifique o provedor que é usado para armazenar tokens na lista negra.
        |
        */

        'storage' => Tymon\JWTAuth\Providers\Storage\Illuminate::class,

    ],

];

# Blueprint do Projeto: API de Autenticação JWT com Laravel

## Visão Geral

Este documento detalha a arquitetura, design e funcionalidades da API de autenticação para a aplicação. O objetivo é fornecer um backend seguro e robusto para gerenciar usuários e suas sessões, utilizando JSON Web Tokens (JWT) como mecanismo de autenticação. O projeto foi construído com o framework Laravel, seguindo as melhores práticas de desenvolvimento.

---

## Design e Funcionalidades Implementadas

Esta seção documenta todas as características e decisões de design implementadas na aplicação desde a sua concepção.

### 1. Estrutura do Backend

*   **Framework**: Laravel 11
*   **Linguagem**: PHP 8.2
*   **Arquitetura**: Model-View-Controller (MVC), com foco em uma API RESTful.

### 2. Autenticação com JWT

*   **Pacote**: `tymon/jwt-auth` foi configurado para gerenciar a geração, validação e atualização de tokens JWT.
*   **Modelo `User`**: O modelo `App\Models\User` foi atualizado para implementar a interface `Tymon\JWTAuth\Contracts\JWTSubject`, tornando-o compatível com o sistema JWT.
*   **Guarda de Autenticação**: Uma nova guarda de autenticação, `api`, foi criada em `config/auth.php`, utilizando o driver `jwt`.
*   **Chave de Segurança**: Uma chave secreta JWT foi gerada e armazenada na variável de ambiente `JWT_SECRET` no arquivo `.env`.

### 3. Estrutura de Rotas da API (versionada)

*   As rotas da API foram definidas no arquivo `routes/api.php` e agrupadas sob o prefixo `/api/v1/` para garantir o versionamento e a escalabilidade futura.
*   **Endpoints Públicos** (dentro de `/auth`):
    *   `POST /login`: Autentica um usuário com e-mail e senha e retorna um token JWT.
    *   `POST /register`: Cria um novo usuário com dados validados.
    *   `POST /check-email`: Verifica se um e-mail já está cadastrado na base de dados.
*   **Endpoints Protegidos** (requerem token JWT e estão dentro de `/auth`):
    *   `POST /logout`: Invalida o token JWT do usuário autenticado.
    *   `POST /refresh`: Gera um novo token JWT a partir de um token válido, estendendo a sessão do usuário.
    *   `GET /me`: Retorna as informações do usuário autenticado.

### 4. Controller de Autenticação

*   Um `API/AuthController` foi criado para centralizar toda a lógica de autenticação.
*   **Validação**: Utiliza o `Validator` do Laravel para validar todos os dados de entrada (`requests`), garantindo a integridade e a segurança dos dados.
*   **Respostas**: Retorna respostas JSON padronizadas com os respectivos códigos de status HTTP (200, 201, 400, 401, 422).

### 5. Segurança e CORS

*   **CORS (Cross-Origin Resource Sharing)**: O middleware `HandleCors` do Laravel foi configurado em `bootstrap/app.php`.
*   **Configuração**: O arquivo `config/cors.php` foi criado para permitir requisições de qualquer origem (`*`) para todos os endpoints da API (`api/*`), facilitando o desenvolvimento de clientes frontend. Para produção, essa configuração pode ser restringida.
*   **Hashing de Senha**: As senhas dos usuários são criptografadas de forma segura usando o `bcrypt` antes de serem salvas no banco de dados.

---

## Plano de Ação (Implementação Atual)

Esta seção descreve os passos que foram executados para atender à sua solicitação de criar a API de autenticação.

1.  **Instalar Dependências**: O pacote `tymon/jwt-auth` foi adicionado ao projeto via Composer.
2.  **Publicar Configuração**: O arquivo de configuração do JWT foi publicado.
3.  **Gerar Chave Secreta**: O comando `php artisan jwt:secret` foi executado para criar a `JWT_SECRET`.
4.  **Atualizar Modelo `User`**: O modelo `User` foi modificado para implementar a interface `JWTSubject`.
5.  **Configurar Guarda de Autenticação**: O arquivo `config/auth.php` foi editado para adicionar a guarda `api` com o driver `jwt`.
6.  **Criar Controller**: O `API/AuthController` foi criado com o comando `php artisan make:controller`.
7.  **Definir Rotas da API**: O arquivo `routes/api.php` foi criado e as rotas de autenticação (públicas e protegidas) foram definidas.
8.  **Configurar CORS**: O arquivo `config/cors.php` foi criado e o middleware foi ativado no `bootstrap/app.php` para permitir requisições cross-origin.
9.  **Referenciar Rotas da API**: O arquivo `bootstrap/app.php` foi atualizado para carregar as rotas do `routes/api.php`.
10. **Implementar Lógica no Controller**: A lógica para registro, login, logout, verificação de e-mail e obtenção de dados do usuário foi implementada no `AuthController` com validação de dados e respostas JSON adequadas.

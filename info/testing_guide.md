# Guia de Testes da API com Thunder Client

Este guia fornece um passo a passo para testar os endpoints da API de autenticação JWT usando a extensão Thunder Client no VS Code.

**Pré-requisito:** Certifique-se de que seu servidor de desenvolvimento Laravel está rodando. Execute o seguinte comando no terminal para iniciá-lo:

```bash
php artisan serve
```

A API estará disponível na URL base: `http://127.0.0.1:8000`

---

### Passo 1: Registrar um Novo Usuário

1.  No Thunder Client, clique em **New Request**.
2.  Selecione o método **POST**.
3.  Insira a URL: `http://127.0.0.1:8000/api/v1/auth/register`
4.  Vá para a aba **Body** e selecione **JSON**.
5.  Cole o seguinte JSON no corpo da requisição. Os campos `avatar`, `phone` e `net_worth` são os únicos opcionais.

    ```json
    {
        "name": "Manuel Teste",
        "email": "manuel.teste@email.com",
        "password": "123456",
        "birthdate": "1990-01-15",
        "gender": "masculino",
        "avatar": "https://exemplo.com/avatar.jpg",
        "phone": "+5511999998888",
        "net_worth": 50000.75
    }
    ```

6.  Clique em **Send**.

*   **Resultado Esperado:** Você deve receber uma resposta com o status **`201 Created`**. O sistema agora cria automaticamente a moeda **Kwanza** e a define como preferida:
    ```json
    {
        "message": "Usuário registrado com sucesso!",
        "user": {
            "id": 1,
            "name": "Manuel Teste",
            "email": "manuel.teste@email.com",
            "preferred_currency_id": 1,
            "preferred_currency": {
                "id": 1,
                "name": "Kwanza",
                "code": "AOA",
                "symbol": "Kz"
            }
        }
    }
    ```

---

### Passo 2: Login - Etapa 1 (Verificar E-mail)

Esta é a primeira parte do fluxo de login em duas etapas.

1.  Crie uma nova requisição (**New Request**).
2.  Selecione o método **POST**.
3.  Insira a URL: `http://127.0.0.1:8000/api/v1/auth/check-email`
4.  Na aba **Body** -> **JSON**, cole o seguinte:

    ```json
    {
        "email": "manuel.teste@email.com"
    }
    ```

5.  Clique em **Send**.

*   **Resultado (Sucesso):** Se o e-mail existir, você receberá um status **`200 OK`** com a seguinte estrutura, indicando que a "Etapa 1" foi concluída e exibindo os dados parciais do usuário:
    ```json
    {
        "status": "step_1_complete",
        "user": {
            "name": "Manuel Teste",
            "email": "manuel.teste@email.com",
            "avatar": "https://exemplo.com/avatar.jpg"
        }
    }
    ```
*   **Resultado (Falha):** Se o e-mail não for encontrado, você receberá um status **`404 Not Found`** com a mensagem `{"error": "Usuário não encontrado"}`.

---

### Passo 3: Login - Etapa 2 (Enviar Senha e Obter Token)

Esta é a segunda parte do fluxo de login, para obter o token de acesso.

1.  Crie uma nova requisição (**New Request**).
2.  Selecione o método **POST**.
3.  Insira a URL: `http://127.0.0.1:8000/api/v1/auth/login`
4.  Na aba **Body** -> **JSON**, cole as credenciais completas (e-mail e senha):

    ```json
    {
        "email": "manuel.teste@email.com",
        "password": "123456"
    }
    ```

5.  Clique em **Send**.

*   **Resultado Esperado:** Status **`200 OK`** e uma resposta contendo o `access_token` e os dados completos do usuário.
*   **Ação Importante:** Copie o valor do `access_token` (sem as aspas). Você precisará dele para as próximas requisições.

---

### Passo 4: Acessar Dados do Usuário (Rota Protegida)

1.  Crie uma nova requisição (**New Request**).
2.  Selecione o método **GET**.
3.  Insira a URL: `http://127.0.0.1:8000/api/v1/auth/me`
4.  Vá para a aba **Auth** e selecione **Bearer**.
5.  No campo **Token**, cole o `access_token` que você copiou no passo anterior.
6.  Clique em **Send**.

*   **Resultado Esperado:** Status **`200 OK`** e uma resposta com os dados completos do utilizador, incluindo a sua `preferred_currency`.

---

### Passo 5: Atualizar o Token (Refresh)

1.  Crie uma nova requisição (**New Request**).
2.  Selecione o método **POST**.
3.  Insira a URL: `http://127.0.0.1:8000/api/v1/auth/refresh`
4.  Vá para a aba **Auth** -> **Bearer** e cole o mesmo token de antes.
5.  Clique em **Send**.

*   **Resultado Esperado:** Status **`200 OK`** e uma resposta com um **novo** `access_token`. O token antigo foi invalidado.

---

### Passo 6: Fazer Logout

1.  Crie uma nova requisição (**New Request**).
2.  Selecione o método **POST**.
3.  Insira a URL: `http://127.0.0.1:8000/api/v1/auth/logout`
4.  Vá para a aba **Auth** -> **Bearer** e cole o **novo** `access_token` que você recebeu no passo de refresh (ou o original, se não tiver feito o refresh).
5.  Clique em **Send**.

*   **Resultado Esperado:** Status **`200 OK`** e a mensagem `{"message":"Logout realizado com sucesso!"}`.

Se você tentar usar o mesmo token novamente para acessar a rota `/api/v1/auth/me`, deverá receber um erro **`401 Unauthorized`**, provando que o logout funcionou.

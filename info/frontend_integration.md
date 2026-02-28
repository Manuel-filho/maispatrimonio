# Referência Completa da API (+ Património)

**Base URL:** `http://127.0.0.1:8000/api/v1`
**Header Obrigatório (Pós-login):** `Authorization: Bearer <token>`

---

## 1. Autenticação & Perfil

### 1.1 Login (Etapa 1: Verificar E-mail)
*   **Endpoint:** `/auth/check-email`
*   **Método:** `POST`
*   **Body:**
```json
{
  "email": "user@exemplo.com"
}
```
*   **Resposta (200 OK):**
```json
{
  "status": "step_1_complete",
  "user": {
    "name": "Nome",
    "email": "user@exemplo.com",
    "avatar": "https://exemplo.com/avatar.jpg"
  }
}
```

### 1.2 Login (Etapa 2: Obter Token)
*   **Endpoint:** `/auth/login`
*   **Método:** `POST`
*   **Body:**
```json
{
  "email": "user@exemplo.com",
  "password": "senha_secreta"
}
```
*   **Resposta (200 OK):**
```json
{
  "access_token": "eyJ0eX...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": { ...dados completos... }
}
```

### 1.3 Registo de Utilizador
*   **Endpoint:** `/auth/register`
*   **Método:** `POST`
*   **Importante sobre Fotos:** Se enviares o campo `avatar`, o pedido (Request) **tem obrigatoriamente** de usar o formato `multipart/form-data` em vez de JSON.
*   **Body (Campos Obrigatórios e Opcionais - FormData):**
```text
name: "João Silva"                // Obrigatório
email: "joao@exemplo.com"         // Obrigatório
password: "senha_forte"           // Obrigatório
birthdate: "1990-01-15"           // Obrigatório (YYYY-MM-DD)
gender: "masculino"               // Obrigatório
avatar: (File: imagem.jpg/png)    // Opcional (Ficheiro físico nativo < 2MB)
phone: "+5511999998888"           // Opcional
net_worth: 50000.75               // Opcional
```

### 1.4 Dados do Perfil e Riqueza (Me)
*   **Endpoint:** `/auth/me`
*   **Método:** `GET`
*   **Nota:** Retorna os dados do utilizador juntamente com o cálculo dinâmico do património atual (`liquidity`, `assets_value`, `total_net_worth` e `max_net_worth`).

---

## 2. Liquidez (Contas e Carteiras)

### 2.1 Listar Contas
*   **Endpoint:** `/accounts`
*   **Método:** `GET`

### 2.2 Criar Conta
*   **Endpoint:** `/accounts`
*   **Método:** `POST`
*   **Body:**
```json
{
  "name": "Carteira Física", // Obrigatório
  "type": "cash",            // Obrigatório
  "balance": 1000.50,        // Obrigatório
  "currency_id": 2           // Opcional (se vazio, usa a preferred_currency do perfil)
}
```

---

## 3. Transações

### 3.1 Registar Transação
*   **Endpoint:** `/transactions`
*   **Método:** `POST`
*   **Body:**
```json
{
  "account_id": 1,               // Obrigatório (ID da conta)
  "category_id": 3,              // Obrigatório (ID da categoria)
  "type": "expense",             // Obrigatório ("revenue" ou "expense") 
  "amount": 5000,                // Obrigatório
  "description": "Supermercado", // Obrigatório
  "transaction_date": "2024-03-15" // Obrigatório
}
```

---

## 4. Categorias (Categories)

### 4.1 Listar Categorias
*   **Endpoint:** `/categories`
*   **Método:** `GET`

### 4.2 Criar Categoria
*   **Endpoint:** `/categories`
*   **Método:** `POST`
*   **Body:**
```json
{
    "name": "Alimentação",                   // Obrigatório
    "type": "expense",                       // Obrigatório ("revenue" ou "expense")
    "description": "Gastos supermercado"     // Opcional
}
```

---

## 5. Moedas (Currencies)

*(Nota: O "Kwanza" é criado automaticamente no registo do utilizador)*

### 5.1 Listar Moedas do Utilizador
*   **Endpoint:** `/currencies`
*   **Método:** `GET`

### 5.2 Criar Moeda
*   **Endpoint:** `/currencies`
*   **Método:** `POST`
*   **Body:**
```json
{
    "name": "Dólar Americano", // Obrigatório
    "code": "USD",             // Obrigatório
    "symbol": "$"              // Obrigatório
}
```

### 5.3 Opcional: Definir Moeda como Preferida
*   **Endpoint:** `/currencies/{id}/set-preferred`
*   **Método:** `POST`
*   **Body:** N/A (basta enviar o ID na URL para tornar a moeda padrão do perfil).

---

## 6. Património Imobilizado (Assets)

### 6.1 Listar Ativos
*   **Endpoint:** `/assets`
*   **Método:** `GET`

### 6.2 Criar Ativo
*   **Endpoint:** `/assets`
*   **Método:** `POST`
*   **Body:**
```json
{
    "name": "Moradia em Talatona",   // Obrigatório
    "type": "imóvel",                // Obrigatório
    "estimated_value": 50000000.00,  // Obrigatório
    "currency_id": 1                 // Obrigatório
}
```
*   **Nota Frontend:** Ao criar, atualizar ou apagar um ativo, o património total (`total_net_worth`) e o Recorde Histórico (`max_net_worth`) do utilizador em `/auth/me` serão recalculados automaticamente pelo backend.

---

## Onde encontrar detalhes técnicos / Modelos completos?
Qualquer dúvida sobre a resposta completa exata (ex: campos do objeto JSON retornado) ou erros de validação (HTTP 422), pode ser totalmente testada no Swagger UI atualizado em tempo real:
👉 **[http://127.0.0.1:8000/docs/api](http://127.0.0.1:8000/docs/api)**

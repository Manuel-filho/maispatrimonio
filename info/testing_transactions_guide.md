# Guia de Testes - Contas e Transações

Este guia explica como testar as funcionalidades de Contas (`Accounts`) e Transações (`Transactions`), incluindo a lógica de atualização automática de saldo.

## 1. Preparação
Certifica-te de que tens um token JWT válido (obtido via `/auth/login`). Adiciona-o ao Header como `Authorization: Bearer {teu_token}`.

---

## 2. Contas (Accounts)

### 2.1. Criar uma Conta
- **Método:** `POST`
- **URL:** `/api/v1/accounts`
- **Corpo (JSON):**
```json
{
    "name": "Conta Corrente Principal",
    "type": "corrente",
    "balance": 1000.00,
    "currency_id": 1
}
```
*Dica: Se omitires o `currency_id`, o sistema usará automaticamente a tua moeda preferida (Kwanza).*

### 2.2. Listar Contas
- **Método:** `GET`
- **URL:** `/api/v1/accounts`

---

## 3. Transações (Transactions)

### 3.1. Criar uma Receita (Revenue)
Este pedido deve **aumentar** o saldo da conta associada.
- **Método:** `POST`
- **URL:** `/api/v1/transactions`
- **Corpo (JSON):**
```json
{
    "account_id": 1, 
    "category_id": 1,
    "description": "Salário Mensal",
    "amount": 2500.00,
    "type": "revenue",
    "date": "2026-03-01"
}
```
*Após este pedido, verifica `/api/v1/accounts/1` e o saldo deverá ser 3500.00.*

### 3.2. Criar uma Despesa (Expense)
Este pedido deve **diminuir** o saldo da conta associada.
- **Método:** `POST`
- **URL:** `/api/v1/transactions`
- **Corpo (JSON):**
```json
{
    "account_id": 1,
    "category_id": 2,
    "description": "Supermercado",
    "amount": 150.00,
    "type": "expense",
    "date": "2026-03-02"
}
```
*Após este pedido, o saldo da conta 1 deverá ser 3350.00.*

### 3.3. Eliminar uma Transação
Ao eliminar a despesa de 150.00, o saldo da conta deve **voltar** para 3500.00.
- **Método:** `DELETE`
- **URL:** `/api/v1/transactions/{id}`

---

## 4. Segurança
- Tenta aceder ou criar uma transação para uma `account_id` que pertence a outro utilizador. O sistema deve retornar `403 Forbidden` ou `404 Not Found`.
- Se tentares atualizar o `amount` de uma transação, o `TransactionService` tratará de recalcular o saldo da conta corretamente (revertendo o valor antigo e aplicando o novo).

## 5. Teste de Saldo Insuficiente (Proteção)
Tenta criar uma despesa maior que o saldo atual da conta:
- **Método:** `POST`
- **URL:** `/api/v1/transactions`
- **Corpo (JSON):**
```json
{
    "account_id": 1,
    "category_id": 2,
    "description": "Compra Luxuosa",
    "amount": 999999.99,
    "type": "expense",
    "date": "2026-03-02"
}
```
*O sistema deve retornar `422 Unprocessable Entity` com a mensagem: "Saldo insuficiente na conta..."*

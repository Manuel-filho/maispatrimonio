# Guia de Testes - Sistema de Moedas (Currencies)

Este guia explica como testar o novo sistema de moedas, incluindo a criação automática e a relação com as contas.

## 1. Criação Automática (Registo)
Ao registar um novo utilizador via `POST /api/v1/auth/register`, o sistema agora cria automaticamente a moeda **Kwanza**.
- Verifica a resposta do registo. O campo `preferred_currency` deve vir preenchido.
- Faz login e chama `GET /api/v1/currencies`. Deves ver o Kwanza na lista.

---

## 2. Gestão de Moedas

### 2.1. Criar uma Nova Moeda (ex: Dólar)
- **Método:** `POST`
- **URL:** `/api/v1/currencies`
- **Corpo (JSON):**
```json
{
    "name": "Dólar Americano",
    "code": "USD",
    "symbol": "$"
}
```

### 2.2. Definir Moeda Preferida
- **Método:** `POST`
- **URL:** `/api/v1/currencies/{id}/set-preferred`
- **Descrição:** Altera a moeda padrão que o utilizador deseja ver no sistema.

---

## 3. Relacionamento com Contas

### 3.1. Criar Conta com Moeda Específica
Se criares uma conta sem enviar `currency_id`, ela usará automaticamente a tua moeda preferida. Para especificar outra:
- **Método:** `POST`
- **URL:** `/api/v1/accounts`
- **Corpo (JSON):**
```json
{
    "name": "Carteira Digital USD",
    "type": "carteira",
    "balance": 500.00,
    "currency_id": 2 
}
```
*Verifica a resposta: o objeto da conta deve incluir os detalhes da moeda associada.*

---

## 4. Regras de Eliminação
- Tenta eliminar a tua moeda preferida. O sistema deve retornar `422 Unprocessable Entity`.
- Tenta eliminar uma moeda que já tenha contas associadas. O sistema deve bloquear com um erro `422`.

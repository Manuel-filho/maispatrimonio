# Guia de Testes - Endpoints de Categoria (API v1)

Este guia contém os exemplos de pedidos para testar os novos endpoints de categorias.

## 1. Variáveis de Ambiente
- **Base URL:** `http://localhost:8000/api/v1`
- **Token:** Necessário no Header `Authorization: Bearer {token}`

## 2. Endpoints

### 2.1. Listar Categorias
- **Método:** `GET`
- **URL:** `/categories`
- **URL Completa:** `http://localhost:8000/api/v1/categories`
- **Descrição:** Lista todas as categorias do utilizador autenticado.

### 2.2. Criar Categoria
- **Método:** `POST`
- **URL:** `/categories`
- **URL Completa:** `http://localhost:8000/api/v1/categories`
- **Body (JSON):**
```json
{
    "name": "Alimentação",
    "type": "expense",
    "description": "Gastos com supermercado e restaurantes"
}
```
*Dica: O `type` deve ser `revenue` para receitas ou `expense` para despesas.*

### 2.3. Ver Detalhes de Categoria
- **Método:** `GET`
- **URL:** `/categories/{id}`
- **URL Completa:** `http://localhost:8000/api/v1/categories/{id}`

### 2.4. Atualizar Categoria
- **Método:** `PUT` / `PATCH`
- **URL:** `/categories/{id}`
- **URL Completa:** `http://localhost:8000/api/v1/categories/{id}`
- **Body (JSON):**
```json
{
    "name": "Lazer",
    "description": "Cinema, passeios e viagens"
}
```

### 2.5. Eliminar Categoria
- **Método:** `DELETE`
- **URL:** `/categories/{id}`
- **URL Completa:** `http://localhost:8000/api/v1/categories/{id}`

## 3. Notas de Segurança
- Tentar aceder a um ID de categoria que pertença a outro utilizador deve retornar `403 Forbidden` ou `404 Not Found` (dependendo da lógica de autorização).

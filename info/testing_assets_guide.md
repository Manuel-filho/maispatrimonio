# Guia de Testes - Gestão de Ativos (Assets) e Património

Este guia explica como testar a gestão de bens imobilizados e o rastreio do recorde de património.

## 1. Criar um Ativo (Asset)
Ao criares um ativo, o teu património total será recalculado automaticamente.
- **Método:** `POST`
- **URL:** `/api/v1/assets`
- **Corpo (JSON):**
```json
{
    "name": "Moradia em Talatona",
    "type": "imóvel",
    "estimated_value": 50000000.00,
    "currency_id": 1
}
```

## 2. Verificar Património no Perfil
Chama o endpoint `/me` para ver os novos campos dinâmicos.
- **URL:** `/api/v1/auth/me`
- **Campos Esperados na Resposta:**
    - `liquidity`: Soma do saldo de todas as contas.
    - `assets_value`: Soma do valor de todos os ativos.
    - `total_net_worth`: Soma de liquidez + ativos.
    - `max_net_worth`: O valor mais alto que o `total_net_worth` já atingiu.

## 3. Testar Recorde Histórico (Max Net Worth)
1. Cria um ativo de valor alto (ex: 1.000.000). O `max_net_worth` subirá para 1.000.000.
2. Elimina esse ativo ou cria uma despesa grande. O `total_net_worth` irá descer, mas o `max_net_worth` deve **manter-se** em 1.000.000.
3. Isto prova que o sistema guarda o teu "Recorde Pessoal".

## 4. Integração Bancária
Cria uma transação de receita (revenue) numa das tuas contas. Verifica se o `total_net_worth` e, se aplicável, o `max_net_worth` são atualizados automaticamente no perfil.

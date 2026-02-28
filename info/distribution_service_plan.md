# 🧠 Orquestrador de Distribuição Financeira (+ Património)

Este documento estabelece a arquitetura, as regras de integridade e os fluxos lógicos para o **Serviço de Distribuição**, o componente central que transforma a aplicação num gestor de riqueza inteligente.

---

## 1. O Conceito: "A Fonte e os Destinos"
A distribuição é tratada como um **fluxo atómico** onde um montante de origem (Fonte) é repartido por múltiplos pontos de aplicação (Destinos). O sistema atua como um orquestrador que garante que nenhum kwanza se perde ou é mal alocado.

### 1.1 Fontes de Capital
*   **Receita Direta (Revenue)**: Capital externo que entra no sistema (ex: Salário, Bónus, Dividendos).
*   **Liquidez Disponível (Account Balance)**: Rebalanceamento de capital já existente em contas bancárias ou carteiras.

### 1.2 Tipos de Destino (A Flexibilidade do Fluxo)
Para evitar distribuições disfuncionais, o utilizador pode escolher três caminhos para o capital:
1.  **Destino Conta (Transferência Real)**: Movimentação física de dinheiro entre entidades financeiras. *Ex: Mandar 20% do salário para a "Poupança".*
2.  **Destino Categoria (Reserva/Orçamento)**: "Carimbar" o dinheiro para gastos futuros sem o mover de conta. *Ex: Reservar 100.000 Kz para "Educação".*
3.  **Destino Transação Imediata (Liquidação)**: Distribuir e pagar uma conta no mesmo instante. *Ex: Pagar a "Internet" assim que o salário cai.*

---

## 2. As 4 Camadas de Validação (O "Cérebro" do Serviço)

Para garantir que o sistema nunca falhe ou crie inconsistências, cada distribuição passa por este filtro rigoroso:

### 🛡️ Camada 1: Integridade Aritmética
*   **Regra**: A soma de todos os destinos deve ser exatamente ≤ 100% do valor da fonte. 
*   **Bloqueio**: O sistema impede que se tente distribuir 1001 Kz se a fonte apenas tem 1000 Kz.

### 🛡️ Camada 2: Validação de Liquidez (Saldo Real)
*   **Regra**: Antes de cada micro-operação de saída, o serviço consulta o saldo real da conta de origem. 
*   **Bloqueio**: Impede a execução se o saldo atual, subtraído das operações pendentes da mesma distribuição, resultar num valor negativo.

### 🛡️ Camada 3: Escudo de Moeda (Currency Shield)
*   **Regra**: Como o sistema é multimoeda, a distribuição deve manter a consistência cambial.
*   **Bloqueio**: Por padrão, o sistema impede distribuições cruzadas (ex: Fonte em AOA para Destino em USD) sem uma taxa de câmbio validada ou conversão explícita, protegendo contra erros de cálculo.

### 🛡️ Camada 4: Transacionalidade Atómica
*   **Regra**: Operação "Tudo ou Nada" baseada em `DB::transaction`.
*   **Bloqueio**: Se houver 10 passos na distribuição e o passo 10 falhar (ex: conta destino bloqueada), os 9 passos anteriores sofrem *Rollback* instantâneo. O teu dinheiro nunca fica "perdido a meio do caminho".

---

## 3. Gestão de Prioridades e Distribuição Disfuncional

O sistema não é apenas passivo; ele deve ser **consultivo**:

### ⚠️ Prioridade de Dívida (Amortização)
Se o utilizador tiver contas com saldo negativo (ex: crédito a descoberto), o sistema apresenta um aviso crítico. A recomendação prioritária de distribuição será a **regularização do saldo negativo** antes de qualquer alocação em lazer ou reservas.

### ⚠️ Verificação de Consistência de Categoria
Impedir que uma distribuição de Receita seja enviada para uma categoria incompatível, reforçando a regra de `Category.type` implementada anteriormente.

---

## 4. Cenários Avançados de Fluxo

### A. O "Dia do Salário" (Template 50/30/20)
O utilizador pode criar **Templates de Distribuição**. Ao marcar uma receita como "Salário", o sistema sugere automaticamente a divisão:
*   50% Necessidades (Categorias: Renda, Comida).
*   30% Estilo de Vida (Categorias: Lazer, Ginásio).
*   20% Liberdade Financeira (Conta: Investimentos).

### B. Rebalanceamento de Liquidez
O utilizador percebe que tem demasiado dinheiro "parado" na conta corrente e decide distribuir 50% desse saldo por objetivos de poupança, movendo o capital para contas de alto rendimento ou ativos imobilizados.

---

## 5. Implementação Técnica Futura
*   **Model**: `Distribution` e `DistributionItem`.
*   **Service**: `DistributionOrchestrator`.
*   **Validations**: Implementação via *Custom Request Rules* e *Service Pipeline*.

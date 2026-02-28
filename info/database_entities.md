# Descrição das Entidades do Banco de Dados

Este documento descreve as entidades (tabelas) que serão usadas no banco de dados da aplicação, em linguagem natural, para sua avaliação.

## 1. Usuário (`user`)

*   **Propósito:** Armazenar as informações do usuário que terá acesso ao sistema.
*   **Campos:**
    *   `id`: Identificador único para cada usuário.
    *   `name`: Nome do usuário.
    *   `email`: Endereço de e-mail do usuário, que será usado para login e deve ser único.
    *   `password`: Senha do usuário (será armazenada de forma segura, com criptografia).
    *   `avatar`: URL para a imagem de perfil do usuário.
    *   `phone`: Número de telefone do usuário.
    *   `birthdate`: Data de nascimento do usuário.
    *   `gender`: Sexo do usuário (ex: "masculino", "feminino", "outro").
    *   `net_worth`: Patrimônio líquido total do usuário.

## 2. Conta (`account`)

*   **Propósito:** Representar as diferentes contas financeiras que um usuário possui (ex: carteira, conta corrente, conta poupança, cartão de crédito).
*   **Relacionamento:** Cada conta pertence a um `usuário`.
*   **Campos:**
    *   `id`: Identificador único para cada conta.
    *   `user_id`: Chave estrangeira para associar a conta ao seu `usuário` proprietário.
    *   `name`: Nome para a conta (ex: "Carteira", "Conta Bradesco").
    *   `type`: O tipo de conta (ex: "conta_corrente", "poupanca", "investimento", "outros").
    *   `balance`: O saldo atual da conta.

## 3. Categoria (`category`)

*   **Propósito:** Classificar as transações para facilitar a análise dos gastos e receitas (ex: "Alimentação", "Transporte", "Salário").
*   **Relacionamento:** Cada categoria pertence a um `usuário`, permitindo que cada um tenha suas próprias categorias.
*   **Campos:**
    *   `id`: Identificador único para cada categoria.
    *   `user_id`: Chave estrangeira para associar a categoria a um `usuário`.
    *   `name`: O nome da categoria (ex: "Moradia", "Lazer").
    *   `type`: O tipo da categoria ("revenue" para receitas, "expense" para despesas). Define se a categoria aparece em fluxos de entrada ou saída.
    *   `description`: Uma descrição opcional para a categoria.

## 4. Transação (`transaction`)

*   **Propósito:** Registrar cada movimentação financeira, seja ela uma receita, uma despesa ou uma transferência entre contas.
*   **Relacionamento:** Cada transação pertence a uma `conta` e a uma `categoria`.
*   **Campos:**
    *   `id`: Identificador único para cada transação.
    *   `account_id`: Chave estrangeira para associar a transação à `conta` onde ocorreu.
    *   `category_id`: Chave estrangeira para associar a transação a uma `categoria`.
    *   `description`: Uma breve descrição da transação (ex: "Almoço no restaurante X").
    *   `amount`: O valor da transação. Para despesas, o valor pode ser armazenado como negativo ou podemos ter um campo de tipo.
    *   `type`: O tipo da transação ("revenue" para receita, "expense" para despesa).
    *   `date`: A data em que a transação foi realizada.

## 5. Meta (`goal`)

*   **Propósito:** Permitir que o usuário defina metas financeiras a serem alcançadas (ex: "Viagem para a Europa", "Comprar um carro").
*   **Relacionamento:** Cada meta pertence a um `usuário`.
*   **Campos:**
    *   `id`: Identificador único para cada meta.
    *   `user_id`: Chave estrangeira para associar a meta ao seu `usuário` proprietário.
    *   `name`: Nome da meta (ex: "Viagem de Férias").
    *   `target_amount`: O valor total que o usuário deseja alcançar.
    *   `current_amount`: O valor que o usuário já acumulou para essa meta.
    *   `due_date`: A data limite para alcançar a meta.

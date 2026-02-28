# + Património

## Sistema de Gestão de Riqueza e Disciplina Financeira

O **+ Património** é uma API robusta desenvolvida em Laravel 11, focada na gestão integral de finanças pessoais e no acompanhamento da evolução patrimonial. Diferente de gestores de despesas convencionais, este sistema separa explicitamente a liquidez imediata dos ativos imobilizados, permitindo uma visão clara do património líquido total e do progresso histórico do utilizador.

---

## Arquitetura e Funcionalidades

### 1. Gestão de Património e Ativos
*   **Liquidez (Accounts)**: Monitorização de contas bancárias, carteiras e contas poupança em tempo real.
*   **Ativos (Assets)**: Registo e valorização de bens imobilizados como imóveis, veículos e investimentos de longo prazo.
*   **Património Líquido Dinâmico**: Cálculo automático da riqueza total somando saldos de contas e valor estimado de ativos.
*   **Recorde Histórico (Max Net Worth)**: Rastreio do ponto mais alto de património atingido pelo utilizador, servindo como indicador de sucesso financeiro.

### 2. Motor de Transações e Segurança
*   **Categorias Inteligentes**: Distinção obrigatória entre receitas (revenue) e despesas (expense) para prevenir erros de lançamento.
*   **Proteção de Saldo**: Validações profundas que impedem operações que resultem em saldos negativos não autorizados.
*   **Atomicidade**: Todas as operações financeiras são executadas dentro de transações de base de dados para garantir integridade absoluta.

### 3. Ecossistema Multimoeda
*   **Moeda Preferida**: Cada utilizador define a sua unidade monetária principal. O Kwanza (AOA) é configurado automaticamente no registo.
*   **Suporte Heterogéneo**: Capacidade de gerir contas e ativos em diferentes moedas dentro do mesmo perfil.

---

## Stack Tecnológica

*   **Framework**: Laravel 11 (PHP 8.2+)
*   **Autenticação**: JWT (JSON Web Tokens) via `tymon/jwt-auth`.
*   **Base de Dados**: PostgreSQL/MySQL com Eloquent ORM.
*   **Documentação API**: Gerada automaticamente via Scramble.

---

## Instalação e Configuração

### Pré-requisitos
*   PHP 8.2 ou superior
*   Composer
*   Servidor de Base de Dados

### Passos de Configuração
1.  Clonar o repositório.
2.  Executar `composer install` para instalar as dependências.
3.  Copiar `.env.example` para `.env` e configurar as credenciais da base de dados.
4.  Gerar a chave da aplicação: `php artisan key:generate`.
5.  Executar as migrações: `php artisan migrate`.
6.  Iniciar o servidor de desenvolvimento: `php artisan serve`.

---

## Documentação Técnica do Projeto

A documentação detalhada sobre regras de negócio, guias de teste e planos de expansão encontra-se no diretório `info/`:

*   [Guia Geral de Testes (Autenticação e Perfil)](file:///f:/Manuel%20Filho/Projetos/Programação/+patrimonio/info/testing_guide.md)
*   [Guia de Contas e Transações](file:///f:/Manuel%20Filho/Projetos/Programação/+patrimonio/info/testing_transactions_guide.md)
*   [Guia de Gestão de Moedas](file:///f:/Manuel%20Filho/Projetos/Programação/+patrimonio/info/testing_currencies_guide.md)
*   [Guia de Ativos e Património Total](file:///f:/Manuel%20Filho/Projetos/Programação/+patrimonio/info/testing_assets_guide.md)
*   [Especificação de Entidades do Banco de Dados](file:///f:/Manuel%20Filho/Projetos/Programação/+patrimonio/info/database_entities.md)
*   [Plano do Orquestrador de Distribuição](file:///f:/Manuel%20Filho/Projetos/Programação/+patrimonio/info/distribution_service_plan.md)

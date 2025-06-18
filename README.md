# Projeto Eco Delivery

# Executando o Projeto Localmente

Para rodar o projeto localmente, basta:

- Clonar o projeto
- Abrir um terminal na raiz do projeto
- Executar `npm install`
- Criar um arquivo `.env` na raiz do projeto contendo as variáveis de ambiente enviadas via Canvas
- Executar `npm run dev`
- Abrir o navegador de internet e ir para `http://localhost:3000`

# Objetivo

Todas as funcionalidades do sistema são providas via o BaaS (Backend as a service) Firebase e Tinify API (minificação de imagens).
Os produtos utilizados são:

- Cloud Firestore (banco de dados NoSQL em tempo real)
- Cloud Storage (banco de dados blob para armazenar imagens)
- OAuth 2.0 Authentication (autenticação utilizando OAuth 2.0 com provedores de terceiros. E.g. Google)
- Remote Config (configuração de items remotos. E.g. feature flag)
- Tinify API (minificação de imagens)

Com isso, o sistema possui:

- Autenticação e autorização via Google
- Abertura e fechamento de loja em tempo real
- Dashboard com métricas de vendas diárias
- Gerenciamento de pedidos em tempo real (deleção, criação, edição e listagem)
- Gerenciamento de produtos (deleção, criação, edição e listagem)
- Gerenciamento de bairros disponíveis para entrega (deleção, criação e listagem)
- Listagem e reimpressão de pedidos faturados
- Gerenciamento de campanhas (deleção, criação e listagem)
- Gerenciamento de usuários do sistema (deleção, criação e listagem)

# Repositório

Este repositório contém o código fonte back-end (`src/app/api` - onde você encontrará uma rota de compressão de imagens e autorização de usuários), front-end e os arquivos de configuração de deploy na nuvem (CI/CD).

# Acesso à Aplicação

https://puc-minas-projetos-integrados.vercel.app/

# Acesso de Validação

Para acessar a aplicação, basta realizar o login com a conta do Google abaixo:
Basta acessar com a conta `71724@sga.pucminas.br` desde que a mesma possua uma conta do Google válida ou então acessar com as seguintes credenciais abaixo:
Email - `pucminasteste0@gmail.com`
senha - `Puc@2603`

# Pipeline CI/CD

Dentro `.github/workflows`, você encontrará um arquivo chamado `vercel.yml`. Ele é o script de deploy para a Vercel.

# Infraestrutura

| Componente               | Plataforma                |
| ------------------------ | ------------------------- |
| Front-end                | Vercel                    |
| Back-end                 | Firebase SDK e Tinify API |
| Autenticação             | Firebase Authentication   |
| CI/CD                    | GitHub Actions            |
| Banco de dados (textual) | Cloud Firestore           |
| Banco de dados (imagens) | Cloud Storage             |

# Requisitos Atendidos

- Acesso web e layout responsivo
- Autenticação a autorização via OAuth
- Persistência em banco de dados
- API backend
- Sistema de controle de versões
- Pipeline CI/CD
- Aplicação publicada em ambiente cloud
- Declaração e isolamento de dependências
- Configurações como variáveis de ambiente
- Registro de eventos (logs)
- Automação de testes
- Entidade simples - CRUD
- Enitdades associadas - CRUD

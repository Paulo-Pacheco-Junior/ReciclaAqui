# ReciclaAqui

Uma plataforma que liga cidadãos e cooperativas no gerenciamento da coleta de recicláveis.

## Rodar

Precisa de **Node.js 20.19 ou superior**.

```bash
git clone https://github.com/Paulo-Pacheco-Junior/ReciclaAqui.git
cd ReciclaAqui
npm install
npm run dev
```

Abra http://localhost:3000

## Banco de dados local

Configure o ambiente local e inicie o PostgreSQL:

```bash
cp -n .env.example .env.local
docker compose up -d
npm run db:migrate
```

`docker compose up -d` inicia o banco; `npm run db:migrate` cria ou atualiza as tabelas. As configurações ficam em `.env.local`, que não é enviado ao Git.

Em produção, configure `DATABASE_URL` e `DIRECT_URL` no painel da plataforma de deploy, sem criar ou commitar um arquivo de ambiente de produção. Para Supabase, use a URL de pool (Supavisor) em `DATABASE_URL` e a URL direta em `DIRECT_URL` para migrations.

O Prisma Client é gerado automaticamente durante `npm install`. Nunca exponha essas URLs em componentes client-side.

## Andamento do Projeto

Rascunho (para finalizar):

- Home com o formulário de endereço
- Header

A fazer:

- Tela de login da cooperativa (`/login`)
- Tela do Kanban com as 3 etapas da coleta (`/coletas`)

- Endpoint para listar os cards
- Endpoint para mover os cards

- Deploy

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

## Banco de dados

O projeto usa Prisma 7 com PostgreSQL. Para configurar o Supabase:

1. Copie `.env.example` para `.env` e preencha as URLs do projeto Supabase.
2. Use a URL de pool (Supavisor) em `DATABASE_URL` para a aplicação e a URL direta em `DIRECT_URL` para migrations.
3. Crie/atualize o schema no banco:

```bash
npm run db:migrate
```

O Prisma Client é gerado automaticamente durante `npm install`. Nunca exponha essas URLs em componentes client-side nem envie o arquivo `.env` ao Git.

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

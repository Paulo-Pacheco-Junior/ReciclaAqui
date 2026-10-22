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

## Acesso das cooperativas

O login e o cadastro usam Supabase Auth. Além das URLs do banco, configure em `.env.local` a URL do projeto, a chave publishable e a URL local da aplicação:

```env
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sua-chave-publishable"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Encontre a URL e a chave publishable nos dados da API do projeto Supabase. Em **Authentication > URL Configuration**, adicione `http://localhost:3000/auth/callback` como URL de redirecionamento permitida. Para aplicar as migrations pendentes no banco remoto, use `npx prisma migrate deploy`.

## Administração e convites

Crie cada usuário administrador em **Supabase > Authentication > Users** e defina `ADMIN_EMAILS` como uma lista de e-mails separados por vírgula, sem espaços obrigatórios. Configure também `SUPABASE_SECRET_KEY` com a chave secreta do projeto Supabase. Mantenha essa chave apenas no servidor, sem o prefixo `NEXT_PUBLIC_`. O administrador entra pela rota `/login`; após autenticar, acessa `/admin` para convidar cooperativas, gerenciar pontos de coleta e acompanhar solicitações. O link de convite é válido por 7 dias, vinculado ao e-mail convidado e só pode ser usado uma vez. A variável antiga `ADMIN_EMAIL` continua aceita para preservar a configuração existente.

Depois de configurar as variáveis, aplique a migration no ambiente: `npx prisma migrate deploy`.

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

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "StatusColeta" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA');

CREATE TABLE "Coleta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "status" "StatusColeta" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coleta_pkey" PRIMARY KEY ("id")
);
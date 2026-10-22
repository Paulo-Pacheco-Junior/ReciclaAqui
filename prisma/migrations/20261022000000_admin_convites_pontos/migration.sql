CREATE TABLE "CooperativaConvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "usadoEm" TIMESTAMP(3),

    CONSTRAINT "CooperativaConvite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PontoColeta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "telefone" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PontoColeta_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Cooperativa" ADD COLUMN "email" TEXT;

CREATE UNIQUE INDEX "CooperativaConvite_email_key" ON "CooperativaConvite"("email");
CREATE UNIQUE INDEX "CooperativaConvite_tokenHash_key" ON "CooperativaConvite"("tokenHash");
CREATE UNIQUE INDEX "Cooperativa_email_key" ON "Cooperativa"("email");
CREATE TABLE "Cooperativa" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cooperativa_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Coleta" ADD COLUMN "cooperativaId" TEXT;

CREATE UNIQUE INDEX "Cooperativa_authUserId_key" ON "Cooperativa"("authUserId");
CREATE INDEX "Coleta_cooperativaId_idx" ON "Coleta"("cooperativaId");

ALTER TABLE "Coleta"
ADD CONSTRAINT "Coleta_cooperativaId_fkey"
FOREIGN KEY ("cooperativaId") REFERENCES "Cooperativa"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
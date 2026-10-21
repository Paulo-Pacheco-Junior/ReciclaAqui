"use server";

import type { Prisma } from "@/generated/prisma/client";
import { getCurrentCooperativa } from "@/lib/cooperativa";
import { getPrismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Aviso = "ocupada" | "erro";

function getColetaId(formData: FormData) {
  const value = formData.get("coletaId");
  return typeof value === "string" ? value.trim() : "";
}

async function requireCooperativa() {
  const cooperativa = await getCurrentCooperativa();

  if (!cooperativa) {
    redirect("/login");
  }

  return cooperativa;
}

// O aviso fica num cookie de poucos segundos: aparece uma vez e some sozinho.
async function setAviso(aviso: Aviso | null) {
  const cookieStore = await cookies();

  if (aviso) {
    cookieStore.set("aviso", aviso, { maxAge: 10, httpOnly: true, sameSite: "lax" });
  } else {
    cookieStore.delete("aviso");
  }
}

// Só altera a coleta se ela ainda estiver como `where` espera; assim duas
// cooperativas nunca pegam a mesma solicitação.
async function moveColeta(
  where: Prisma.ColetaWhereInput,
  data: Prisma.ColetaUncheckedUpdateManyInput,
  avisoIfUnchanged: Aviso,
) {
  try {
    const { count } = await getPrismaClient().coleta.updateMany({ where, data });
    await setAviso(count === 0 ? avisoIfUnchanged : null);
  } catch {
    await setAviso("erro");
  }

  revalidatePath("/kanban");
}

export async function claimColeta(formData: FormData) {
  const cooperativa = await requireCooperativa();

  await moveColeta(
    { id: getColetaId(formData), cooperativaId: null, status: "PENDENTE" },
    { cooperativaId: cooperativa.id, status: "EM_ANDAMENTO" },
    "ocupada",
  );
}

export async function updateColetaStatus(formData: FormData) {
  const cooperativa = await requireCooperativa();
  const nextStatus = formData.get("status");

  if (nextStatus !== "EM_ANDAMENTO" && nextStatus !== "CONCLUIDA") {
    await setAviso("erro");
    return;
  }

  const currentStatus = nextStatus === "CONCLUIDA" ? "EM_ANDAMENTO" : "CONCLUIDA";

  await moveColeta(
    { id: getColetaId(formData), cooperativaId: cooperativa.id, status: currentStatus },
    { status: nextStatus },
    "erro",
  );
}

export async function releaseColeta(formData: FormData) {
  const cooperativa = await requireCooperativa();

  await moveColeta(
    { id: getColetaId(formData), cooperativaId: cooperativa.id, status: "EM_ANDAMENTO" },
    { cooperativaId: null, status: "PENDENTE" },
    "erro",
  );
}

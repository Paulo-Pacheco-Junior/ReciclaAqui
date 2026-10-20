"use server";

import { getCurrentCooperativa } from "@/lib/cooperativa";
import { getPrismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getColetaId(formData: FormData) {
  const value = formData.get("coletaId");
  return typeof value === "string" ? value.trim() : "";
}

export async function claimColeta(formData: FormData) {
  const cooperativa = await getCurrentCooperativa();
  const coletaId = getColetaId(formData);

  if (!cooperativa || !coletaId) {
    redirect("/login");
  }

  let result;

  try {
    result = await getPrismaClient().coleta.updateMany({
      where: {
        id: coletaId,
        cooperativaId: null,
        status: "PENDENTE",
      },
      data: {
        cooperativaId: cooperativa.id,
        status: "EM_ANDAMENTO",
      },
    });
  } catch {
    redirect("/kanban?aviso=erro");
  }

  if (result.count === 0) {
    redirect("/kanban?aviso=ocupada");
  }

  revalidatePath("/kanban");
}

export async function updateColetaStatus(formData: FormData) {
  const cooperativa = await getCurrentCooperativa();
  const coletaId = getColetaId(formData);
  const nextStatus = formData.get("status");

  if (!cooperativa || !coletaId) {
    redirect("/login");
  }

  if (nextStatus !== "EM_ANDAMENTO" && nextStatus !== "CONCLUIDA") {
    redirect("/kanban?aviso=erro");
  }

  const currentStatus = nextStatus === "CONCLUIDA" ? "EM_ANDAMENTO" : "CONCLUIDA";
  const result = await getPrismaClient().coleta.updateMany({
    where: {
      id: coletaId,
      cooperativaId: cooperativa.id,
      status: currentStatus,
    },
    data: { status: nextStatus },
  });

  if (result.count === 0) {
    redirect("/kanban?aviso=erro");
  }

  revalidatePath("/kanban");
}
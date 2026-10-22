"use server";

import { randomBytes, createHash } from "node:crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getCurrentAdmin, isAdminEmail } from "@/lib/admin";
import { getPrismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AdminActionState = { error?: string; message?: string; inviteUrl?: string };

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Acesso restrito ao administrador.");
  return admin;
}

export async function createInvite(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const email = text(formData, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Informe um e-mail válido." };
  }

  const prisma = getPrismaClient();
  if (await prisma.cooperativa.findUnique({ where: { email }, select: { id: true } })) {
    return { error: "Este e-mail já possui uma conta de cooperativa." };
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.cooperativaConvite.upsert({
    where: { email },
    create: { email, tokenHash, expiraEm: expiresAt },
    update: { tokenHash, expiraEm: expiresAt, usadoEm: null, criadoEm: new Date() },
  });

  revalidatePath("/admin/contas");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return { inviteUrl: `${siteUrl}/cadastro?convite=${token}`, message: "Convite criado. O link expira em 7 dias." };
}

export async function createPonto(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const nome = text(formData, "nome");
  const endereco = text(formData, "endereco");
  const cidade = text(formData, "cidade");
  const estado = text(formData, "estado").toUpperCase();
  const telefone = text(formData, "telefone");
  const latitudeValue = text(formData, "latitude");
  const longitudeValue = text(formData, "longitude");
  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);

  if (
    nome.length < 2 || !endereco || !cidade || !/^[A-Z]{2}$/.test(estado) ||
    !latitudeValue || !longitudeValue ||
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180
  ) {
    return { error: "Confira os dados e as coordenadas do ponto de coleta." };
  }

  await getPrismaClient().pontoColeta.create({
    data: { nome, endereco, cidade, estado, telefone: telefone || null, latitude, longitude },
  });
  revalidatePath("/admin/pontos");
  revalidatePath("/cooperativas");
  return { message: "Ponto de coleta cadastrado." };
}

export async function deletePonto(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await getPrismaClient().pontoColeta.deleteMany({ where: { id } });
  revalidatePath("/admin/pontos");
  revalidatePath("/cooperativas");
}

export async function deleteInvite(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  await getPrismaClient().cooperativaConvite.deleteMany({ where: { id, usadoEm: null } });
  revalidatePath("/admin/contas");
}

export async function deleteCooperativa(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return { error: "Conta inválida." };

  const prisma = getPrismaClient();
  const cooperativa = await prisma.cooperativa.findUnique({ where: { id } });
  if (!cooperativa) return { error: "Esta conta não existe mais." };
  if (cooperativa.authUserId === admin.userId || isAdminEmail(cooperativa.email ?? "")) {
    return { error: "Contas administrativas não podem ser excluídas por esta tela." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecret) {
    return { error: "Configure a chave secreta do Supabase no servidor." };
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabaseAdmin.auth.admin.deleteUser(cooperativa.authUserId);
  if (error && error.code !== "user_not_found") {
    return { error: "Não foi possível excluir o usuário no Supabase. Tente novamente." };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.coleta.updateMany({
        where: { cooperativaId: id, status: "EM_ANDAMENTO" },
        data: { cooperativaId: null, status: "PENDENTE" },
      });
      await transaction.cooperativa.delete({ where: { id } });
    });
  } catch {
    return { error: "O acesso foi removido, mas não foi possível concluir a limpeza dos dados. Atualize a lista e tente novamente." };
  }

  revalidatePath("/admin/contas");
  revalidatePath("/admin/coletas");
  revalidatePath("/admin");
  return { message: `A conta de ${cooperativa.nome} foi excluída.` };
}

export async function adminUpdateColeta(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id || !["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"].includes(status)) return;
  const prisma = getPrismaClient();
  const coleta = await prisma.coleta.findUnique({
    where: { id },
    select: { status: true, cooperativaId: true },
  });
  if (!coleta) return;
  const selectedCooperativaId = text(formData, "cooperativaId");
  const cooperativaId = status === "PENDENTE" ? null : selectedCooperativaId || coleta.cooperativaId;
  if (
    status !== "PENDENTE" &&
    (!cooperativaId || !(await prisma.cooperativa.findUnique({ where: { id: cooperativaId }, select: { id: true } })))
  ) return;
  await prisma.coleta.update({
    where: { id },
    data: {
      status: status as "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA",
      cooperativaId,
    },
  });
  revalidatePath("/admin/coletas");
  revalidatePath("/kanban");
}
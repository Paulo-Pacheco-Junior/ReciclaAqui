"use server";

import { getPrismaClient } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { redirect } from "next/navigation";

export type AuthFormState = {
  error?: string;
  message?: string;
};

function getField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function signIn(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");

  if (!validEmail(email) || !password) {
    return { error: "Informe um e-mail válido e sua senha." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Configure a URL e a chave pública do Supabase no arquivo .env.local." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "E-mail ou senha inválidos." };
  }

  if (isAdminEmail(email)) {
    redirect("/admin");
  }

  redirect("/kanban");
}

export async function signUp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const nome = getField(formData, "nome");
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");
  const inviteToken = getField(formData, "convite");

  if (!inviteToken) {
    return { error: "Você ainda não foi convidado, solicite um convite ao administrador" };
  }

  if (nome.length < 2 || !validEmail(email) || password.length < 8) {
    return {
      error: "Informe o nome da cooperativa, um e-mail válido e uma senha com pelo menos 8 caracteres.",
    };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Configure a URL e a chave pública do Supabase no arquivo .env.local." };
  }

  const prisma = getPrismaClient();
  const invite = inviteToken
    ? await prisma.cooperativaConvite.findUnique({
        where: { tokenHash: createHash("sha256").update(inviteToken).digest("hex") },
      })
    : null;

  if (
    !invite ||
    invite.email !== email ||
    invite.usadoEm ||
    invite.expiraEm <= new Date()
  ) {
    return { error: "Você ainda não foi convidado, solicite um convite ao administrador" };
  }

  const reservation = await prisma.cooperativaConvite.updateMany({
    where: { id: invite.id, usadoEm: null, expiraEm: { gt: new Date() } },
    data: { usadoEm: new Date() },
  });
  if (reservation.count !== 1) {
    return { error: "Este convite já foi utilizado ou expirou. Solicite um novo ao administrador." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecret) {
    await prisma.cooperativaConvite.update({ where: { id: invite.id }, data: { usadoEm: null } });
    return { error: "Configure a chave secreta do Supabase no servidor." };
  }

  const adminClient = createSupabaseClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { cooperativa_nome: nome },
  });

  if (error || !data.user) {
    await prisma.cooperativaConvite.update({ where: { id: invite.id }, data: { usadoEm: null } });
    return { error: "Não foi possível criar a conta. Confira os dados e tente novamente." };
  }

  try {
    await prisma.cooperativa.create({
      data: { authUserId: data.user.id, email, nome },
    });
  } catch {
    await adminClient.auth.admin.deleteUser(data.user.id);
    await prisma.cooperativaConvite.update({ where: { id: invite.id }, data: { usadoEm: null } });
    return { error: "Não foi possível finalizar o cadastro. Tente novamente." };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    return { message: "Conta criada. Entre com seu e-mail e senha para continuar." };
  }

  redirect("/kanban");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
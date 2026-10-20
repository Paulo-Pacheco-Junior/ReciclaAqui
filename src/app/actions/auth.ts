"use server";

import { getPrismaClient } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
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

async function saveCooperativa(authUserId: string, nome: string) {
  await getPrismaClient().cooperativa.upsert({
    where: { authUserId },
    create: { authUserId, nome },
    update: { nome },
  });
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

  const metadataName = data.user.user_metadata.cooperativa_nome;
  const nome =
    typeof metadataName === "string" && metadataName.trim()
      ? metadataName.trim()
      : email;

  await saveCooperativa(data.user.id, nome);
  redirect("/kanban");
}

export async function signUp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const nome = getField(formData, "nome");
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");

  if (nome.length < 2 || !validEmail(email) || password.length < 8) {
    return {
      error: "Informe o nome da cooperativa, um e-mail válido e uma senha com pelo menos 8 caracteres.",
    };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Configure a URL e a chave pública do Supabase no arquivo .env.local." };
  }

  const supabase = await createClient();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
    .replace(/\/$/, "");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { cooperativa_nome: nome },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/kanban`,
    },
  });

  if (error) {
    return { error: "Não foi possível criar a conta. Confira os dados e tente novamente." };
  }

  if (!data.user || data.user.identities?.length === 0) {
    return {
      message: "Se o e-mail puder ser cadastrado, você receberá uma mensagem para confirmar a conta.",
    };
  }

  await saveCooperativa(data.user.id, nome);

  if (data.session) {
    redirect("/kanban");
  }

  return {
    message: "Cadastro iniciado. Confira seu e-mail para confirmar a conta e entrar.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
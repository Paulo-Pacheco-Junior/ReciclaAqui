"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthFormState } from "@/app/actions/auth";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    isSignup ? signUp : signIn,
    {},
  );

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-5xl items-center gap-12 px-4 py-12 md:grid-cols-[1fr_0.8fr] md:py-16">
      <section className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-800">
          Área das cooperativas
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-emerald-950">
          {isSignup ? "Sua cooperativa, conectada." : "Bem-vinda de volta."}
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-neutral-700">
          {isSignup
            ? "Cadastre sua equipe para acompanhar solicitações de coleta e organizar o atendimento em um só lugar."
            : "Entre para acompanhar solicitações e atualizar o andamento das coletas da sua cooperativa."}
        </p>
      </section>

      <section className="rounded-xl bg-cartao px-6 py-8 shadow-sm ring-1 ring-borda sm:px-9">
        <h2 className="text-2xl font-semibold text-emerald-950">
          {isSignup ? "Cadastrar cooperativa" : "Entrar"}
        </h2>
        <form action={formAction} className="mt-7 space-y-5">
          {isSignup && (
            <div className="space-y-1.5">
              <label htmlFor="nome" className="text-sm font-medium text-neutral-800">
                Nome da cooperativa
              </label>
              <input
                id="nome"
                name="nome"
                autoComplete="organization"
                required
                minLength={2}
                className="w-full rounded-lg border border-campo bg-cartao px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-neutral-800">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-campo bg-cartao px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-neutral-800">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={isSignup ? 8 : undefined}
              className="w-full rounded-lg border border-campo bg-cartao px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            />
            {isSignup && (
              <p className="text-xs text-neutral-600">Use pelo menos 8 caracteres.</p>
            )}
          </div>

          {(state.error || state.message) && (
            <p
              role={state.error ? "alert" : "status"}
              className={`text-sm ${state.error ? "text-red-700" : "text-emerald-900"}`}
            >
              {state.error ?? state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
          >
            {isPending
              ? "Aguarde..."
              : isSignup
                ? "Criar conta"
                : "Entrar no painel"}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-700">
          {isSignup ? "Já tem uma conta? " : "Sua cooperativa ainda não tem conta? "}
          <Link
            href={isSignup ? "/login" : "/cadastro"}
            className="font-semibold text-emerald-900 underline underline-offset-4"
          >
            {isSignup ? "Entrar" : "Cadastre-se"}
          </Link>
        </p>
      </section>
    </div>
  );
}
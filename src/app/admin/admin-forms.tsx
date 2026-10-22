"use client";

import { useActionState, useState } from "react";
import { createInvite, createPonto, deleteCooperativa, type AdminActionState } from "@/app/actions/admin";

const initialState: AdminActionState = {};
const fieldClass = "w-full rounded-md border border-campo bg-cartao px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20";

function ActionMessage({ state }: { state: AdminActionState }) {
  if (!state.error && !state.message) return null;
  return <p role={state.error ? "alert" : "status"} className={`text-sm ${state.error ? "text-red-700" : "text-emerald-900"}`}>{state.error ?? state.message}</p>;
}

export function InviteForm() {
  const [state, action, pending] = useActionState(createInvite, initialState);
  const [copied, setCopied] = useState(false);
  return (
    <form action={action} className="space-y-3">
      <label className="block space-y-1.5 text-sm font-medium">
        E-mail da cooperativa
        <input className={fieldClass} type="email" name="email" required autoComplete="email" />
      </label>
      <button disabled={pending} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {pending ? "Gerando..." : "Gerar convite"}
      </button>
      <ActionMessage state={state} />
      {state.inviteUrl && (
        <label className="block space-y-1.5 text-sm font-medium">
          Link para enviar
          <span className="flex gap-2">
            <input className={fieldClass} readOnly value={state.inviteUrl} onFocus={(event) => event.currentTarget.select()} />
            <button type="button" title="Copiar convite" aria-label="Copiar convite" className="shrink-0 rounded-md border border-campo px-3 text-sm hover:bg-painel" onClick={() => { void navigator.clipboard.writeText(state.inviteUrl!).then(() => setCopied(true)); }}>
              {copied ? "Copiado" : "Copiar"}
            </button>
          </span>
        </label>
      )}
    </form>
  );
}

export function PontoForm() {
  const [state, action, pending] = useActionState(createPonto, initialState);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Nome<input className={fieldClass} name="nome" required minLength={2} /></label>
      <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Endereço<input className={fieldClass} name="endereco" required /></label>
      <label className="space-y-1.5 text-sm font-medium">Cidade<input className={fieldClass} name="cidade" required /></label>
      <label className="space-y-1.5 text-sm font-medium">UF<input className={fieldClass} name="estado" required minLength={2} maxLength={2} /></label>
      <label className="space-y-1.5 text-sm font-medium">Telefone<input className={fieldClass} name="telefone" type="tel" /></label>
      <label className="space-y-1.5 text-sm font-medium">Latitude<input className={fieldClass} name="latitude" type="number" required min={-90} max={90} step="any" /></label>
      <label className="space-y-1.5 text-sm font-medium">Longitude<input className={fieldClass} name="longitude" type="number" required min={-180} max={180} step="any" /></label>
      <div className="space-y-2 sm:col-span-2">
        <button disabled={pending} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">{pending ? "Salvando..." : "Cadastrar ponto"}</button>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

export function DeleteCooperativaForm({ id, nome }: { id: string; nome: string }) {
  const [state, action, pending] = useActionState(deleteCooperativa, initialState);
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Excluir a conta de ${nome}? Os pedidos em andamento voltarão para a fila.`)) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-start gap-1"
    >
      <input type="hidden" name="id" value={id} />
      <button disabled={pending} className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60">
        {pending ? "Excluindo..." : "Excluir conta"}
      </button>
      {state.error && <p role="alert" className="max-w-56 text-xs text-red-700">{state.error}</p>}
      {state.message && <p role="status" className="text-xs text-emerald-800">{state.message}</p>}
    </form>
  );
}
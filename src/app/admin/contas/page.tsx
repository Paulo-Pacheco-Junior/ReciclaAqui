import { deleteInvite } from "@/app/actions/admin";
import { DeleteCooperativaForm, InviteForm } from "@/app/admin/admin-forms";
import { getCurrentAdmin } from "@/lib/admin";
import { getPrismaClient } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminContasPage() {
  if (!(await getCurrentAdmin())) redirect("/login");

  const prisma = getPrismaClient();
  const [cooperativas, convites] = await Promise.all([
    prisma.cooperativa.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, email: true } }),
    prisma.cooperativaConvite.findMany({ orderBy: { criadoEm: "desc" } }),
  ]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Administração</p>
        <h1 className="mt-1 text-3xl font-semibold text-emerald-950">Contas e convites</h1>
      </header>

      <section className="grid gap-8 border-y border-borda py-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <h2 className="mb-3 text-base font-semibold text-emerald-950">Convidar cooperativa</h2>
          <InviteForm />
        </div>
        <div>
          <h2 className="mb-3 text-base font-semibold text-emerald-950">Cooperativas cadastradas ({cooperativas.length})</h2>
          {cooperativas.length ? (
            <ul className="divide-y divide-borda border-y border-borda">
              {cooperativas.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0"><strong className="font-medium">{item.nome}</strong><span className="ml-2 text-neutral-600">{item.email ?? "E-mail não registrado"}</span></span>
                  <DeleteCooperativaForm id={item.id} nome={item.nome} />
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-neutral-600">Nenhuma conta cadastrada.</p>}
        </div>
      </section>

      <section className="py-6">
        <h2 className="mb-3 text-base font-semibold text-emerald-950">Convites ({convites.length})</h2>
        {convites.length ? (
          <ul className="divide-y divide-borda border-y border-borda">
            {convites.map((invite) => {
              const status = invite.usadoEm ? "Usado" : invite.expiraEm <= new Date() ? "Expirado" : "Aguardando cadastro";
              return (
                <li key={invite.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span>{invite.email}<span className="ml-2 text-neutral-500">{status}</span></span>
                  {!invite.usadoEm && (
                    <form action={deleteInvite}>
                      <input type="hidden" name="id" value={invite.id} />
                      <button className="text-red-700 underline underline-offset-2">Revogar</button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-neutral-600">Nenhum convite enviado.</p>}
      </section>
    </div>
  );
}
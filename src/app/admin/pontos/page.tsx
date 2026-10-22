import { deletePonto } from "@/app/actions/admin";
import { PontoForm } from "@/app/admin/admin-forms";
import { getCurrentAdmin } from "@/lib/admin";
import { getPrismaClient } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPontosPage() {
  if (!(await getCurrentAdmin())) redirect("/login");
  const pontos = await getPrismaClient().pontoColeta.findMany({
    orderBy: [{ estado: "asc" }, { cidade: "asc" }, { nome: "asc" }],
  });

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Administração</p>
        <h1 className="mt-1 text-3xl font-semibold text-emerald-950">Pontos de coleta</h1>
      </header>

      <section className="grid gap-8 border-y border-borda py-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div><h2 className="mb-3 text-base font-semibold text-emerald-950">Cadastrar novo ponto</h2><PontoForm /></div>
        <div>
          <h2 className="mb-3 text-base font-semibold text-emerald-950">Pontos publicados ({pontos.length})</h2>
          {pontos.length ? (
            <ul className="divide-y divide-borda border-y border-borda">
              {pontos.map((ponto) => (
                <li key={ponto.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span><strong>{ponto.nome}</strong><span className="block text-neutral-600">{ponto.cidade}, {ponto.estado} · {ponto.endereco}</span></span>
                  <form action={deletePonto}><input type="hidden" name="id" value={ponto.id} /><button className="text-red-700 underline underline-offset-2">Remover</button></form>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-neutral-600">Nenhum ponto cadastrado pela administração.</p>}
        </div>
      </section>
    </div>
  );
}
import { adminUpdateColeta } from "@/app/actions/admin";
import { getCurrentAdmin } from "@/lib/admin";
import { getPrismaClient } from "@/lib/prisma";
import { redirect } from "next/navigation";

type AdminColetasPageProps = { searchParams: Promise<{ cooperativa?: string }> };
const selectClass = "h-10 rounded-md border border-campo bg-cartao px-3 text-sm";

export default async function AdminColetasPage({ searchParams }: AdminColetasPageProps) {
  if (!(await getCurrentAdmin())) redirect("/login");
  const prisma = getPrismaClient();
  const [{ cooperativa: requestedId }, cooperativas, totais] = await Promise.all([
    searchParams,
    prisma.cooperativa.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    Promise.all([
      prisma.coleta.count({ where: { status: "PENDENTE", cooperativaId: null } }),
      prisma.coleta.count({ where: { status: "EM_ANDAMENTO" } }),
      prisma.coleta.count({ where: { status: "CONCLUIDA" } }),
    ]),
  ]);
  const cooperativa = cooperativas.find((item) => item.id === requestedId) ?? cooperativas[0] ?? null;
  const [coletas, disponiveis] = await Promise.all([
    cooperativa
      ? prisma.coleta.findMany({ where: { cooperativaId: cooperativa.id }, orderBy: { atualizadoEm: "desc" }, take: 50 })
      : Promise.resolve([]),
    prisma.coleta.findMany({
      where: { status: "PENDENTE", cooperativaId: null },
      orderBy: { criadoEm: "asc" },
      take: 50,
      select: { id: true, material: true, cidade: true, estado: true, criadoEm: true },
    }),
  ]);
  const [pendentes, andamento, concluidas] = totais;

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Administração</p>
        <h1 className="mt-1 text-3xl font-semibold text-emerald-950">Acompanhamento das coletas</h1>
      </header>

      <section aria-label="Resumo das solicitações" className="grid grid-cols-3 gap-3 border-y border-borda py-4">
        {[["Disponíveis", pendentes], ["Em andamento", andamento], ["Concluídas", concluidas]].map(([label, value]) => (
          <div key={label}><p className="text-sm text-neutral-600">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-950">{value}</p></div>
        ))}
      </section>

      <section className="border-b border-borda py-5">
        <form action="/admin/coletas" className="flex flex-wrap items-center gap-2">
          <label htmlFor="cooperativa" className="text-sm font-medium">Painel da cooperativa</label>
          <select id="cooperativa" name="cooperativa" defaultValue={cooperativa?.id ?? ""} className={selectClass}>
            {cooperativas.length === 0 && <option value="">Nenhuma cooperativa</option>}
            {cooperativas.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
          <button className="h-10 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800">Abrir painel</button>
        </form>
        <p className="mt-2 text-sm text-neutral-600">{cooperativa ? `Visualizando ${cooperativa.nome}.` : "Cadastre uma cooperativa para abrir o painel."}</p>
      </section>

      {cooperativa && <>
        <section className="py-5">
          <h2 className="mb-3 text-base font-semibold text-emerald-950">Pedidos atribuídos</h2>
          <div className="overflow-x-auto border-y border-borda">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-neutral-600"><tr><th className="py-2 pr-3">Pedido</th><th className="py-2 pr-3">Solicitante</th><th className="py-2 pr-3">Local</th><th className="py-2 pr-3">Status</th><th className="py-2">Ação</th></tr></thead>
              <tbody className="divide-y divide-borda">
                {coletas.map((coleta) => (
                  <tr key={coleta.id}>
                    <td className="py-3 pr-3">{coleta.material}</td><td className="py-3 pr-3">{coleta.nome}</td><td className="py-3 pr-3">{coleta.cidade}, {coleta.estado}</td>
                    <td className="py-3 pr-3">{coleta.status.replaceAll("_", " ")}</td>
                    <td className="py-3"><form action={adminUpdateColeta} className="flex gap-2"><input type="hidden" name="id" value={coleta.id} /><input type="hidden" name="cooperativaId" value={cooperativa.id} /><select name="status" defaultValue={coleta.status} className="h-9 rounded-md border border-campo bg-cartao px-2"><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluída</option><option value="PENDENTE">Devolver à fila</option></select><button className="rounded-md border border-campo px-3 font-medium hover:bg-painel">Salvar</button></form></td>
                  </tr>
                ))}
                {coletas.length === 0 && <tr><td colSpan={5} className="py-5 text-center text-neutral-500">Sem solicitações atribuídas.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="py-5">
          <h2 className="mb-3 text-base font-semibold text-emerald-950">Pedidos disponíveis para atribuir</h2>
          <ul className="divide-y divide-borda border-y border-borda">
            {disponiveis.map((coleta) => (
              <li key={coleta.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span>{coleta.material} · {coleta.cidade}, {coleta.estado}</span>
                <form action={adminUpdateColeta} className="flex items-center gap-2"><input type="hidden" name="id" value={coleta.id} /><input type="hidden" name="cooperativaId" value={cooperativa.id} /><input type="hidden" name="status" value="EM_ANDAMENTO" /><button className="rounded-md bg-emerald-700 px-3 py-2 font-semibold text-white hover:bg-emerald-800">Atribuir</button></form>
              </li>
            ))}
            {disponiveis.length === 0 && <li className="py-4 text-sm text-neutral-500">Nenhuma solicitação disponível.</li>}
          </ul>
        </section>
      </>}
    </div>
  );
}
import { signOut } from "@/app/actions/auth";
import { claimColeta, updateColetaStatus } from "@/app/actions/coletas";
import { getCurrentCooperativa } from "@/lib/cooperativa";
import { getPrismaClient } from "@/lib/prisma";
import { redirect } from "next/navigation";

type KanbanPageProps = {
  searchParams: Promise<{ aviso?: string }>;
};

const columns = [
  { status: "PENDENTE", title: "Disponíveis" },
  { status: "EM_ANDAMENTO", title: "Em andamento" },
  { status: "CONCLUIDA", title: "Concluídas" },
] as const;

export default async function KanbanPage({ searchParams }: KanbanPageProps) {
  const cooperativa = await getCurrentCooperativa();

  if (!cooperativa) {
    redirect("/login");
  }

  const [{ aviso }, coletas] = await Promise.all([
    searchParams,
    getPrismaClient().coleta.findMany({
      where: {
        OR: [
          { status: "PENDENTE", cooperativaId: null },
          { cooperativaId: cooperativa.id },
        ],
      },
      orderBy: { criadoEm: "asc" },
    }),
  ]);

  const avisoTexto =
    aviso === "ocupada"
      ? "Outra cooperativa já assumiu essa solicitação."
      : aviso === "erro"
        ? "Não foi possível atualizar a solicitação. Tente novamente."
        : null;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f5f7f1] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-emerald-950/20 pb-6">
          <div>
            <p className="text-sm font-medium text-emerald-800">Painel da cooperativa</p>
            <h1 className="mt-1 text-3xl font-semibold text-emerald-950">
              {cooperativa.nome}
            </h1>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="border border-neutral-400 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-white"
            >
              Sair
            </button>
          </form>
        </header>

        <div className="flex flex-wrap items-baseline justify-between gap-2 py-6">
          <h2 className="text-xl font-semibold text-neutral-900">Solicitações de coleta</h2>
          <p className="text-sm text-neutral-600">
            {coletas.length} {coletas.length === 1 ? "solicitação" : "solicitações"}
          </p>
        </div>

        {avisoTexto && (
          <p role="alert" className="mb-5 border-l-4 border-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {avisoTexto}
          </p>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map((column) => {
            const columnColetas = coletas.filter((coleta) => coleta.status === column.status);

            return (
              <section key={column.status} aria-labelledby={`column-${column.status}`}>
                <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-2">
                  <h3 id={`column-${column.status}`} className="font-semibold text-emerald-950">
                    {column.title}
                  </h3>
                  <span className="text-sm tabular-nums text-neutral-600">{columnColetas.length}</span>
                </div>

                <div className="space-y-3 pt-3">
                  {columnColetas.map((coleta) => {
                    const available = coleta.cooperativaId === null;

                    return (
                      <article key={coleta.id} className="border border-neutral-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
                          {coleta.material}
                        </p>
                        <p className="mt-2 text-sm font-medium text-neutral-900">
                          {coleta.cidade && coleta.estado
                            ? `${coleta.cidade}, ${coleta.estado}`
                            : "Localização não informada"}
                        </p>
                        <p className="mt-2 text-sm text-neutral-700">{coleta.horario}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Recebida em {coleta.criadoEm.toLocaleDateString("pt-BR")}
                        </p>

                        {!available && (
                          <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-3 text-sm">
                            <div>
                              <dt className="text-xs text-neutral-500">Solicitante</dt>
                              <dd className="font-medium text-neutral-900">{coleta.nome}</dd>
                            </div>
                            <div>
                              <dt className="text-xs text-neutral-500">Telefone</dt>
                              <dd className="text-neutral-800">{coleta.telefone}</dd>
                            </div>
                            <div>
                              <dt className="text-xs text-neutral-500">Endereço</dt>
                              <dd className="text-neutral-800">{coleta.endereco}</dd>
                            </div>
                          </dl>
                        )}

                        <form action={available ? claimColeta : updateColetaStatus} className="mt-4">
                          <input type="hidden" name="coletaId" value={coleta.id} />
                          {available ? (
                            <button
                              type="submit"
                              className="w-full bg-emerald-800 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
                            >
                              Assumir solicitação
                            </button>
                          ) : (
                            <>
                              <input
                                type="hidden"
                                name="status"
                                value={column.status === "CONCLUIDA" ? "EM_ANDAMENTO" : "CONCLUIDA"}
                              />
                              <button
                                type="submit"
                                className="w-full border border-emerald-800 px-3 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                              >
                                {column.status === "CONCLUIDA" ? "Reabrir coleta" : "Marcar como concluída"}
                              </button>
                            </>
                          )}
                        </form>
                      </article>
                    );
                  })}

                  {columnColetas.length === 0 && (
                    <p className="border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
                      Nenhuma solicitação nesta etapa.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
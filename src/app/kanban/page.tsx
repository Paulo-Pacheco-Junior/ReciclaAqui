import { isUf, ufs } from "@/lib/coleta";
import { getCurrentCooperativa } from "@/lib/cooperativa";
import { getPrismaClient } from "@/lib/prisma";
import Form from "next/form";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AutoRefresh } from "./auto-refresh";
import { AvailableCard, ClaimedCard } from "./coleta-card";

type KanbanPageProps = {
  searchParams: Promise<{ uf?: string; cidade?: string; coluna?: string }>;
};

const RECENT_COMPLETED = 20;

const controlClass =
  "h-9 rounded-md border border-campo bg-cartao px-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600";

function FilterForm({ uf, cidade }: { uf: string; cidade: string }) {
  return (
    // A key recria o formulário quando o filtro muda (por exemplo, em "Limpar").
    <Form
      key={`${uf}|${cidade}`}
      action="/kanban"
      aria-label="Filtrar disponíveis"
      className="flex items-center gap-1.5 lg:mt-2"
    >
      <label htmlFor="filtro-uf" className="sr-only">
        UF
      </label>
      <select id="filtro-uf" name="uf" defaultValue={uf} className={`${controlClass} w-20`}>
        <option value="">UF</option>
        {ufs.map((sigla) => (
          <option key={sigla} value={sigla}>
            {sigla}
          </option>
        ))}
      </select>
      <label htmlFor="filtro-cidade" className="sr-only">
        Cidade
      </label>
      <input
        id="filtro-cidade"
        name="cidade"
        defaultValue={cidade}
        placeholder="Cidade"
        className={`${controlClass} min-w-0 flex-1`}
      />
      <button
        type="submit"
        className="h-9 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        Filtrar
      </button>
      {(uf || cidade) && (
        <Link
          href="/kanban"
          className="px-1 text-xs font-medium text-neutral-600 underline hover:text-neutral-900"
        >
          Limpar
        </Link>
      )}
    </Form>
  );
}

export default async function KanbanPage({ searchParams }: KanbanPageProps) {
  const cooperativa = await getCurrentCooperativa();

  if (!cooperativa) {
    redirect("/login");
  }

  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const uf = typeof params.uf === "string" && isUf(params.uf) ? params.uf : "";
  const cidade = typeof params.cidade === "string" ? params.cidade.trim() : "";
  const aviso = cookieStore.get("aviso")?.value;

  const prisma = getPrismaClient();
  const mine = { cooperativaId: cooperativa.id };

  const [available, inProgress, completed, completedTotal] = await Promise.all([
    prisma.coleta.findMany({
      where: {
        status: "PENDENTE",
        cooperativaId: null,
        estado: uf || undefined,
        cidade: cidade ? { contains: cidade, mode: "insensitive" } : undefined,
      },
      // Nome, telefone e endereço só aparecem depois que a cooperativa escolhe coletar.
      select: {
        id: true,
        material: true,
        horario: true,
        cidade: true,
        estado: true,
        criadoEm: true,
      },
      orderBy: { criadoEm: "asc" },
    }),
    prisma.coleta.findMany({
      where: { ...mine, status: "EM_ANDAMENTO" },
      orderBy: { criadoEm: "asc" },
    }),
    prisma.coleta.findMany({
      where: { ...mine, status: "CONCLUIDA" },
      orderBy: { atualizadoEm: "desc" },
      take: RECENT_COMPLETED,
    }),
    prisma.coleta.count({ where: { ...mine, status: "CONCLUIDA" } }),
  ]);

  const avisoTexto =
    aviso === "ocupada"
      ? "Outra cooperativa já vai coletar esse pedido."
      : aviso === "erro"
        ? "Não foi possível atualizar a solicitação. Tente novamente."
        : null;

  const columns = [
    {
      id: "disponiveis",
      title: "Disponíveis",
      dot: "bg-amber-500",
      total: available.length,
      cards: available.map((coleta) => (
        <AvailableCard key={coleta.id} coleta={coleta} />
      )),
      empty:
        uf || cidade
          ? "Nenhuma solicitação disponível com esse filtro."
          : "Nenhuma solicitação disponível.",
    },
    {
      id: "em-andamento",
      title: "Em andamento",
      dot: "bg-emerald-600",
      total: inProgress.length,
      cards: inProgress.map((coleta) => (
        <ClaimedCard key={coleta.id} coleta={coleta} cooperativaNome={cooperativa.nome} />
      )),
      empty: "Escolha um pedido disponível para coletar e ele aparece aqui.",
    },
    {
      id: "concluidas",
      title: "Concluídas",
      dot: "bg-neutral-400",
      total: completedTotal,
      cards: completed.map((coleta) => (
        <ClaimedCard key={coleta.id} coleta={coleta} cooperativaNome={cooperativa.nome} />
      )),
      note:
        completedTotal > completed.length
          ? `Mostrando as ${completed.length} mais recentes.`
          : undefined,
      empty: "Nenhuma coleta concluída ainda.",
    },
  ];

  // No celular aparece uma coluna por vez, escolhida nas abas; no monitor, as três.
  const activeColumn = columns.some((column) => column.id === params.coluna)
    ? params.coluna
    : "disponiveis";

  function columnHref(id: string) {
    const query = new URLSearchParams();
    if (uf) query.set("uf", uf);
    if (cidade) query.set("cidade", cidade);
    if (id !== "disponiveis") query.set("coluna", id);
    const search = query.toString();
    return search ? `/kanban?${search}` : "/kanban";
  }

  return (
    <div className="min-h-[calc(100dvh-var(--header-height))] px-4 py-4 sm:px-6 lg:flex lg:h-[calc(100dvh-var(--header-height))] lg:flex-col lg:px-8">
      <AutoRefresh />

      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 lg:min-h-0 lg:flex-1">
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
            Painel da cooperativa
          </p>
          <h1 className="text-xl font-semibold text-emerald-950 sm:text-2xl">
            {cooperativa.nome}
          </h1>
        </header>

        {avisoTexto && (
          <p
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
          >
            {avisoTexto}
          </p>
        )}

        <nav
          aria-label="Colunas"
          className="sticky top-0 z-10 -mx-4 bg-fundo px-4 py-1 sm:-mx-6 sm:px-6 lg:hidden"
        >
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-emerald-950/5 p-1">
            {columns.map((column) => {
              const active = column.id === activeColumn;

              return (
                <Link
                  key={column.id}
                  href={columnHref(column.id)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-1 py-1.5 text-center text-xs font-semibold transition-colors ${
                    active
                      ? "bg-cartao text-emerald-950 shadow-sm"
                      : "text-neutral-600 hover:text-emerald-950"
                  }`}
                >
                  {column.title}{" "}
                  <span className="tabular-nums text-neutral-500">{column.total}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {columns.map((column) => (
            <section
              key={column.id}
              aria-labelledby={`titulo-${column.id}`}
              className={`${
                column.id === activeColumn ? "flex" : "hidden"
              } min-w-0 flex-col rounded-xl bg-painel/90 ring-1 ring-borda lg:flex lg:min-h-0`}
            >
              {/* No celular a aba já diz qual é a coluna; o título só aparece no monitor. */}
              <div
                className={`border-b border-borda px-3 py-2.5 ${
                  column.id === "disponiveis" ? "" : "hidden lg:block"
                }`}
              >
                <div className="hidden items-center justify-between gap-2 lg:flex">
                  <h2
                    id={`titulo-${column.id}`}
                    className="flex items-center gap-2 text-sm font-semibold text-emerald-950"
                  >
                    <span aria-hidden="true" className={`size-2 rounded-full ${column.dot}`} />
                    {column.title}
                  </h2>
                  <span className="rounded-full bg-emerald-950/5 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-950">
                    {column.total}
                  </span>
                </div>

                {column.id === "disponiveis" && <FilterForm uf={uf} cidade={cidade} />}
              </div>

              {/* Disponíveis fica mais larga no monitor, com dois cards por linha. */}
              <div
                className={`grid flex-1 content-start gap-2 p-2 [scrollbar-width:thin] lg:min-h-0 lg:overflow-y-auto ${
                  column.id === "disponiveis" ? "xl:grid-cols-2" : ""
                }`}
              >
                {column.cards}

                {column.cards.length === 0 && (
                  <p className="rounded-lg border border-dashed border-campo px-3 py-6 text-center text-sm text-neutral-500 xl:col-span-full">
                    {column.empty}
                  </p>
                )}

                {column.note && (
                  <p className="py-1 text-center text-xs text-neutral-500">{column.note}</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

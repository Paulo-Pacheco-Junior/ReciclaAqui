import { formatDate } from "@/lib/coleta";
import { getPrismaClient } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

const currentStep = { PENDENTE: 1, EM_ANDAMENTO: 2, CONCLUIDA: 3 };

export default async function AcompanharPage({
  params,
}: PageProps<"/acompanhar/[id]">) {
  // Sempre consulta o banco, para o status nunca ficar desatualizado.
  await connection();
  const { id } = await params;

  // Página pública: nada de nome, telefone ou endereço.
  const coleta = await getPrismaClient().coleta.findUnique({
    where: { id },
    select: {
      id: true,
      material: true,
      cidade: true,
      estado: true,
      status: true,
      criadoEm: true,
      atualizadoEm: true,
      cooperativa: { select: { nome: true } },
    },
  });

  if (!coleta) {
    notFound();
  }

  const cooperativaNome = coleta.cooperativa?.nome ?? "Uma cooperativa parceira";
  const step = currentStep[coleta.status];

  const summary = {
    PENDENTE:
      "Seu pedido está visível para as cooperativas cadastradas. A cooperativa que for coletar vai entrar em contato pelo telefone informado.",
    EM_ANDAMENTO: `${cooperativaNome} vai coletar o seu pedido e vai entrar em contato para combinar a retirada.`,
    CONCLUIDA: "A coleta foi concluída. Obrigado por reciclar!",
  }[coleta.status];

  const steps = [
    { title: "Solicitação recebida", detail: formatDate(coleta.criadoEm) },
    { title: "Cooperativa vai coletar", detail: cooperativaNome },
    { title: "Coleta concluída", detail: "Material retirado" },
  ];

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-800">
          Acompanhe sua solicitação
        </h1>
        <p className="mt-2 text-sm text-neutral-600">{summary}</p>
      </div>

      <div className="rounded-xl border border-borda bg-cartao p-6 shadow-sm">
        <ol className="space-y-4">
          {steps.map((item, index) => {
            const done = index < step;

            return (
              <li key={item.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    done
                      ? "bg-emerald-700 text-white"
                      : "border border-campo text-neutral-400"
                  }`}
                >
                  {done ? "✓" : index + 1}
                </span>
                <div>
                  <p className={`text-sm font-medium ${done ? "text-neutral-900" : "text-neutral-500"}`}>
                    {item.title}
                    <span className="sr-only">{done ? " (feito)" : " (aguardando)"}</span>
                  </p>
                  {done && <p className="text-sm text-neutral-600">{item.detail}</p>}
                </div>
              </li>
            );
          })}
        </ol>

        <dl className="mt-6 space-y-3 border-t border-borda pt-4 text-sm">
          <div>
            <dt className="text-xs text-neutral-500">Material</dt>
            <dd className="text-neutral-900">{coleta.material}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Local</dt>
            <dd className="text-neutral-900">
              {coleta.cidade && coleta.estado
                ? `${coleta.cidade}, ${coleta.estado}`
                : "Não informado"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Última atualização</dt>
            <dd className="text-neutral-900">{formatDate(coleta.atualizadoEm)}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Protocolo</dt>
            <dd className="break-all font-mono text-neutral-900">{coleta.id}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="font-medium text-emerald-700 hover:text-emerald-800">
          Fazer outra solicitação
        </Link>
      </p>
    </div>
  );
}

import { getCurrentAdmin } from "@/lib/admin";
import { getPrismaClient } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const prisma = getPrismaClient();
  const [total, pendentes, andamento, concluidas] = await Promise.all([
    prisma.coleta.count(),
    prisma.coleta.count({ where: { status: "PENDENTE", cooperativaId: null } }),
    prisma.coleta.count({ where: { status: "EM_ANDAMENTO" } }),
    prisma.coleta.count({ where: { status: "CONCLUIDA" } }),
  ]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Administração</p>
          <h1 className="mt-1 text-3xl font-semibold text-emerald-950">Visão geral</h1>
          <p className="mt-1 text-sm text-neutral-600">Sessão administrativa: {admin.email}</p>
        </div>
      </header>

      <section aria-label="Resumo geral" className="grid grid-cols-2 gap-3 border-y border-borda py-4 sm:grid-cols-4">
        {[["Solicitações", total], ["Disponíveis", pendentes], ["Em andamento", andamento], ["Concluídas", concluidas]].map(([label, value]) => (
          <div key={label} className="py-1">
            <p className="text-sm text-neutral-600">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-950">{value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
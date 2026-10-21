import Form from "next/form";
import { redirect } from "next/navigation";
import { RecentList } from "./recent-list";

type AcompanharBuscaProps = {
  searchParams: Promise<{ protocolo?: string }>;
};

export default async function AcompanharBuscaPage({ searchParams }: AcompanharBuscaProps) {
  const { protocolo } = await searchParams;
  const id = typeof protocolo === "string" ? protocolo.trim() : "";

  if (id) {
    redirect(`/acompanhar/${encodeURIComponent(id)}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-800">
          Acompanhar pedido
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Digite o número do protocolo que apareceu quando você enviou a solicitação.
        </p>
      </div>

      <div className="rounded-xl border border-borda bg-cartao p-6 shadow-sm">
        <Form action="/acompanhar" className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="protocolo" className="sr-only">
            Número do protocolo
          </label>
          <input
            id="protocolo"
            name="protocolo"
            required
            autoComplete="off"
            placeholder="Ex: cmvi1ak7o00037wojr02la18y"
            className="min-w-0 flex-1 rounded-lg border border-campo px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800"
          >
            Consultar
          </button>
        </Form>

        <RecentList />
      </div>
    </div>
  );
}

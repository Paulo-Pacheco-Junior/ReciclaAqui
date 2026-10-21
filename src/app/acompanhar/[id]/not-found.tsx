import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-emerald-800">
        Solicitação não encontrada
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Confira se o link ou o número do protocolo está completo.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800"
      >
        Fazer uma solicitação
      </Link>
    </div>
  );
}

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4">
        <Link href="/" className="shrink-0 text-lg font-semibold text-emerald-600">
          Recicla Aqui
        </Link>

        <nav className="order-3 flex w-full flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-neutral-600 sm:order-none sm:ml-auto sm:w-auto sm:gap-6">
          <Link href="/cooperativas" className="transition-colors hover:text-neutral-900">
            Pontos de Coleta
          </Link>

          <Link href="/guia-reciclagem" className="transition-colors hover:text-neutral-900">
            Guia de Descarte
          </Link>

          <Link href="/sobre" className="transition-colors hover:text-neutral-900">
            Sobre nós
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-3">
          <Link
            href="/login"
            className="px-2 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:px-3"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 sm:px-4"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </header>
  );
}
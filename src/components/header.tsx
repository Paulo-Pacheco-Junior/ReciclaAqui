import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { getCurrentAdmin } from "@/lib/admin";
import { getCurrentCooperativa } from "@/lib/cooperativa";
import { NavLinks } from "./nav-links";

export async function Header() {
  // Se o banco estiver fora do ar, o site público continua abrindo.
  const [cooperativa, admin] = await Promise.all([
    getCurrentCooperativa().catch(() => null),
    getCurrentAdmin().catch(() => null),
  ]);

  return (
    <header className="border-b border-borda bg-cartao/85 px-4 backdrop-blur sm:px-6 lg:h-[var(--header-height)] lg:px-8">
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-x-4 gap-y-2 py-3 lg:h-full lg:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold text-emerald-800">
          <Image src="/logo.png" alt="" width={28} height={28} className="size-7 object-contain" />
          Recicla Aqui
        </Link>

        {/* Abaixo do monitor, os links ficam numa linha só, que desliza para o lado;
            o esmaecido na borda mostra que tem mais. */}
        <nav className="order-3 flex w-full gap-x-5 overflow-x-auto whitespace-nowrap pb-1 pr-6 text-sm font-medium text-neutral-600 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] lg:order-none lg:ml-auto lg:w-auto lg:gap-6 lg:overflow-visible lg:pb-0 lg:pr-0 lg:[mask-image:none]">
          <NavLinks
            links={[
              { href: "/cooperativas", label: "Pontos de Coleta" },
              { href: "/guia-reciclagem", label: "Guia de Descarte" },
              { href: "/acompanhar", label: "Acompanhar pedido" },
              { href: "/sobre", label: "Sobre nós" },
            ]}
          />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-0">
          {cooperativa || admin ? (
            <>
              <form action={signOut}>
                <button
                  type="submit"
                  className="px-2 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:px-3"
                >
                  Sair
                </button>
              </form>

              <Link
                href={admin ? "/admin" : "/kanban"}
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 sm:px-4"
              >
                {admin ? "Administração" : "Painel"}
              </Link>
            </>
          ) : (
            <>
              {/* Login das cooperativas, sempre visível; o cidadão não precisa entrar. */}
              <Link
                href="/login"
                title="Entrar na área da cooperativa"
                className="rounded-lg border border-emerald-700/40 px-3 py-2 text-sm font-medium text-emerald-900 transition-colors hover:bg-cartao"
              >
                <span className="hidden xl:inline">Cooperativa? </span>Entrar
              </Link>

              <Link
                href="/"
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 sm:px-4"
              >
                Solicitar coleta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

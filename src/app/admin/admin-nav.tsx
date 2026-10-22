"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/contas", label: "Contas e convites" },
  { href: "/admin/coletas", label: "Solicitações" },
  { href: "/admin/pontos", label: "Pontos de coleta" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação administrativa" className="sticky top-0 z-30 border-b border-borda bg-cartao/95 px-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-screen-xl gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-emerald-700 text-emerald-950"
                  : "border-transparent text-neutral-600 hover:text-emerald-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinksProps = {
  links: { href: string; label: string; className?: string }[];
};

// Destaca o link da página atual, para a pessoa saber onde está.
export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();

  return links.map((link) => {
    const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`transition-colors hover:text-neutral-900 ${
          active ? "text-emerald-900 underline decoration-2 underline-offset-8" : ""
        } ${link.className ?? ""}`}
      >
        {link.label}
      </Link>
    );
  });
}

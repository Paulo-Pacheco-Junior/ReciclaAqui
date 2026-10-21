"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { parseRecentes, readRecentesRaw } from "@/lib/recentes";

const noSubscribe = () => () => {};

// O servidor não vê o localStorage: lá a lista sai vazia e o navegador preenche.
export function RecentList() {
  const raw = useSyncExternalStore(noSubscribe, readRecentesRaw, () => "[]");
  const recentes = parseRecentes(raw);

  if (recentes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-borda pt-4">
      <h2 className="text-sm font-semibold text-neutral-800">
        Suas solicitações recentes
      </h2>
      <ul className="mt-3 space-y-2">
        {recentes.map((item) => (
          <li key={item.id}>
            <Link
              href={`/acompanhar/${item.id}`}
              className="block rounded-lg border border-borda px-3 py-2.5 hover:bg-painel"
            >
              <span className="block text-sm font-medium text-neutral-900">
                {item.material}
              </span>
              <span className="block text-xs text-neutral-500">
                Enviada em {new Date(item.criadoEm).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

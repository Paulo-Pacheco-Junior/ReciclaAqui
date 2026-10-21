"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INTERVAL_MS = 30_000;

// Busca os dados do painel de novo a cada 30 s, só enquanto a aba está visível.
// Ao voltar para a aba (ou desbloquear o celular), atualiza na hora.
export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    function refreshIfVisible() {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }

    const timer = setInterval(refreshIfVisible, INTERVAL_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [router]);

  return null;
}

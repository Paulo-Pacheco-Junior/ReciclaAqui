export type SolicitacaoRecente = {
  id: string;
  material: string;
  criadoEm: string;
};

const KEY = "reciclaaqui:solicitacoes";
const MAX = 5;

// O localStorage pode falhar (aba anônima, dados bloqueados); nesse caso a lista fica vazia.
export function readRecentesRaw() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function parseRecentes(raw: string): SolicitacaoRecente[] {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function readRecentes() {
  return parseRecentes(readRecentesRaw());
}

export function saveRecente(item: SolicitacaoRecente) {
  try {
    const list = [item, ...readRecentes().filter((r) => r.id !== item.id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

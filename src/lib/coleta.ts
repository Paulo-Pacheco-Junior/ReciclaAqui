export const ufs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Mesmas categorias do Guia de Descarte, com nomes curtos para caber no celular.
export const materialOptions = [
  "Computadores e notebooks",
  "Monitores e periféricos",
  "Celulares e tablets",
  "TVs, som e videogames",
  "Eletrodomésticos",
  "Baterias e carregadores",
  "Cabos e fios",
  "Outros",
];

export const weekDays = [
  { value: "seg", label: "Seg", name: "segunda" },
  { value: "ter", label: "Ter", name: "terça" },
  { value: "qua", label: "Qua", name: "quarta" },
  { value: "qui", label: "Qui", name: "quinta" },
  { value: "sex", label: "Sex", name: "sexta" },
  { value: "sab", label: "Sáb", name: "sábado" },
  { value: "dom", label: "Dom", name: "domingo" },
];

export const dayPeriods = [
  { value: "manha", label: "Manhã", hours: "8h às 12h", text: "de manhã" },
  { value: "tarde", label: "Tarde", hours: "12h às 18h", text: "à tarde" },
  { value: "noite", label: "Noite", hours: "18h às 21h", text: "à noite" },
];

export const fieldLimits = {
  nome: 100,
  telefone: 20,
  materialDetalhes: 150,
  horarioObs: 100,
  cep: 9,
  rua: 120,
  numero: 10,
  complemento: 60,
  bairro: 80,
  cidade: 80,
  estado: 2,
};

export function isUf(value: string) {
  return ufs.includes(value);
}

// Só dígitos, com o código do Brasil (55). Retorna null se faltar o DDD.
export function phoneWithCountryCode(telefone: string) {
  const digits = telefone.replace(/\D/g, "");

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    return digits;
  }

  return null;
}

// Máscara enquanto digita: (51) 3333-4444 ou (51) 98765-4321.
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  const split = digits.length === 11 ? 7 : 6;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, split)}-${digits.slice(split)}`;
}

export function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function joinWords(words: string[], last: string) {
  if (words.length <= 1) {
    return words[0] ?? "";
  }

  return `${words.slice(0, -1).join(", ")} ${last} ${words[words.length - 1]}`;
}

const dayRanges: Record<string, string> = {
  "seg,ter,qua,qui,sex,sab,dom": "Todos os dias",
  "seg,ter,qua,qui,sex,sab": "Segunda a sábado",
  "seg,ter,qua,qui,sex": "Segunda a sexta",
  "sab,dom": "Sábado e domingo",
};

// O banco guarda um texto pronto, por exemplo:
// "Segunda a sexta, de manhã ou à tarde (depois das 14h)".
export function describeSchedule(days: string[], periods: string[], note: string) {
  const chosenDays = weekDays.filter((day) => days.includes(day.value));
  const chosenPeriods = dayPeriods.filter((period) => periods.includes(period.value));

  if (chosenDays.length === 0 || chosenPeriods.length === 0) {
    return null;
  }

  const dayList = joinWords(chosenDays.map((day) => day.name), "e");
  const dayText =
    dayRanges[chosenDays.map((day) => day.value).join(",")] ??
    dayList.charAt(0).toUpperCase() + dayList.slice(1);
  const periodText = joinWords(chosenPeriods.map((period) => period.text), "ou");

  return `${dayText}, ${periodText}${note ? ` (${note})` : ""}`;
}

// Ex.: "Celulares e tablets, Cabos e fios (2 celulares antigos)".
export function describeMaterial(categories: string[], details: string) {
  const chosen = materialOptions.filter((option) => categories.includes(option));

  if (chosen.length === 0) {
    return null;
  }

  return details ? `${chosen.join(", ")} (${details})` : chosen.join(", ");
}

// Em produção o servidor roda em UTC; sem o fuso fixo, pedidos feitos à noite
// apareceriam com a data do dia seguinte.
const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatDate(date: Date) {
  return dateFormat.format(date);
}

// "2026-10-21" no horário de Brasília, para contar dias de calendário.
const dayFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });

export function daysSince(date: Date) {
  const today = Date.parse(dayFormat.format(new Date()));
  return Math.round((today - Date.parse(dayFormat.format(date))) / 86_400_000);
}

export function formatAge(days: number) {
  if (days <= 0) {
    return "hoje";
  }

  return days === 1 ? "ontem" : `há ${days} dias`;
}

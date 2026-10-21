import { claimColeta, releaseColeta, updateColetaStatus } from "@/app/actions/coletas";
import type { Coleta } from "@/generated/prisma/client";
import { daysSince, formatAge, formatDate, phoneWithCountryCode } from "@/lib/coleta";
import {
  ChatIcon,
  CheckIcon,
  ClockIcon,
  MapIcon,
  PhoneIcon,
  PinIcon,
  ReturnIcon,
  UndoIcon,
  UserIcon,
} from "@/components/icons";
import { SubmitButton } from "./submit-button";

export type ColetaResumo = Pick<
  Coleta,
  "id" | "material" | "horario" | "cidade" | "estado" | "criadoEm"
>;

const cardClass =
  "flex flex-col rounded-lg border border-borda bg-cartao p-3 shadow-sm transition-shadow hover:shadow-md";
const buttonClass =
  "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors";
const primaryButton = `${buttonClass} bg-emerald-700 text-white hover:bg-emerald-800`;
// Ações secundárias com borda e ícone, para não parecerem texto solto.
const outlineButton = `${buttonClass} gap-1.5 border border-campo bg-cartao text-neutral-700 hover:border-emerald-600 hover:text-emerald-800`;
// Devolver é desistir do pedido: neutro como os outros, avermelhado só ao passar o mouse.
const releaseButton = `${buttonClass} gap-1.5 border border-campo bg-cartao text-neutral-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700`;
const contactLink =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-borda px-2 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-emerald-600 hover:text-emerald-800 lg:py-1.5";
const metaClass = "flex items-start gap-1.5 text-xs text-neutral-600";
const metaIcon = "mt-px size-3.5 text-emerald-700";

// Quanto mais tempo esperando, mais forte a cor: ajuda a ver o que é urgente.
function AgeBadge({ date }: { date: Date }) {
  const days = daysSince(date);
  const tone =
    days >= 7
      ? "bg-red-50 text-red-700"
      : days >= 3
        ? "bg-amber-50 text-amber-800"
        : "bg-painel text-neutral-600";

  return (
    <span
      title={`Recebida em ${formatDate(date)}`}
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}
    >
      {formatAge(days)}
    </span>
  );
}

function Title({ children }: { children: string }) {
  return (
    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">
      {children}
    </h3>
  );
}

function Location({ coleta }: { coleta: ColetaResumo }) {
  return (
    <p className={metaClass}>
      <PinIcon className={metaIcon} />
      {coleta.cidade && coleta.estado
        ? `${coleta.cidade}, ${coleta.estado}`
        : "Local não informado"}
    </p>
  );
}

function Schedule({ horario }: { horario: string }) {
  return (
    <p className={metaClass}>
      <ClockIcon className={metaIcon} />
      <span className="line-clamp-2">{horario}</span>
    </p>
  );
}

export function AvailableCard({ coleta }: { coleta: ColetaResumo }) {
  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between gap-2">
        <Title>{coleta.material}</Title>
        <AgeBadge date={coleta.criadoEm} />
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-2">
        <div className="min-w-0 space-y-1">
          <Location coleta={coleta} />
          <Schedule horario={coleta.horario} />
        </div>

        <form action={claimColeta} className="shrink-0">
          <input type="hidden" name="coletaId" value={coleta.id} />
          <SubmitButton className={primaryButton}>Vou coletar</SubmitButton>
        </form>
      </div>
    </article>
  );
}

type ClaimedCardProps = {
  coleta: Coleta;
  cooperativaNome: string;
};

function ContactLinks({ coleta, cooperativaNome }: ClaimedCardProps) {
  const phone = phoneWithCountryCode(coleta.telefone);
  const whatsappText = `Olá, ${coleta.nome}! Aqui é da cooperativa ${cooperativaNome}. Vimos sua solicitação de coleta no ReciclaAqui e queremos combinar a retirada.`;
  const address = [coleta.endereco, coleta.cidade, coleta.estado]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mt-3 flex gap-1.5">
      {phone && (
        <>
          <a href={`tel:+${phone}`} className={contactLink}>
            <PhoneIcon className="size-3.5" />
            Ligar
          </a>
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={contactLink}
          >
            <ChatIcon className="size-3.5" />
            WhatsApp
          </a>
        </>
      )}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={contactLink}
      >
        <MapIcon className="size-3.5" />
        Mapa
      </a>
    </div>
  );
}

function CompletedCard({ coleta }: { coleta: Coleta }) {
  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between gap-2">
        <Title>{coleta.material}</Title>
        <span
          title={`Concluída em ${formatDate(coleta.atualizadoEm)}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800"
        >
          <CheckIcon className="size-3" />
          {formatAge(daysSince(coleta.atualizadoEm))}
        </span>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <Location coleta={coleta} />
          <p className={metaClass}>
            <UserIcon className={metaIcon} />
            {coleta.nome}
          </p>
        </div>

        <form action={updateColetaStatus} className="shrink-0">
          <input type="hidden" name="coletaId" value={coleta.id} />
          <input type="hidden" name="status" value="EM_ANDAMENTO" />
          <SubmitButton
            className={outlineButton}
            title="Concluiu por engano? Volta para Em andamento."
          >
            <UndoIcon className="size-4" />
            Desfazer
          </SubmitButton>
        </form>
      </div>
    </article>
  );
}

export function ClaimedCard({ coleta, cooperativaNome }: ClaimedCardProps) {
  if (coleta.status === "CONCLUIDA") {
    return <CompletedCard coleta={coleta} />;
  }

  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between gap-2">
        <Title>{coleta.material}</Title>
        <AgeBadge date={coleta.criadoEm} />
      </div>

      <div className="mt-2 space-y-1">
        <Location coleta={coleta} />
        <Schedule horario={coleta.horario} />
      </div>

      <div className="mt-3 space-y-1 border-t border-borda/60 pt-3">
        <p className="flex items-start gap-1.5 text-sm text-neutral-900">
          <UserIcon className="mt-0.5 size-3.5 text-neutral-500" />
          <span>
            <span className="font-medium">{coleta.nome}</span>
            <span className="text-neutral-600"> · {coleta.telefone}</span>
          </span>
        </p>
        <p className="pl-5 text-xs leading-relaxed text-neutral-600">{coleta.endereco}</p>
      </div>

      <ContactLinks coleta={coleta} cooperativaNome={cooperativaNome} />

      <div className="mt-2 flex gap-2">
        <form action={updateColetaStatus} className="flex-1">
          <input type="hidden" name="coletaId" value={coleta.id} />
          <input type="hidden" name="status" value="CONCLUIDA" />
          <SubmitButton
            className={`${primaryButton} w-full gap-1.5`}
            title="A coleta foi feita: vai para Concluídas."
          >
            <CheckIcon className="size-4" />
            Concluir
          </SubmitButton>
        </form>

        <form action={releaseColeta}>
          <input type="hidden" name="coletaId" value={coleta.id} />
          <SubmitButton
            className={releaseButton}
            title="Não vai coletar? O pedido volta para Disponíveis."
            confirmMessage="Devolver este pedido para a fila? Ele volta para Disponíveis e qualquer cooperativa poderá coletá-lo."
          >
            <ReturnIcon className="size-4" />
            Devolver à fila
          </SubmitButton>
        </form>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode, type SubmitEvent } from "react";
import {
  dayPeriods,
  fieldLimits,
  formatCep,
  formatPhone,
  materialOptions,
  ufs,
  weekDays,
} from "@/lib/coleta";
import { saveRecente } from "@/lib/recentes";

const inputClass =
  "rounded-lg border border-campo bg-cartao px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600";
const labelClass = "text-sm font-medium text-neutral-700";
const sectionClass =
  "flex flex-col gap-4 border-t border-borda pt-5 first:border-t-0 first:pt-0";
const sectionTitleClass = "text-base font-semibold text-neutral-800";

export function ColetaForm() {
  const [protocolo, setProtocolo] = useState<string | null>(null);

  if (protocolo) {
    return (
      <SuccessMessage protocolo={protocolo} onNewRequest={() => setProtocolo(null)} />
    );
  }

  return <RequestForm onSent={setProtocolo} />;
}

type SuccessMessageProps = {
  protocolo: string;
  onNewRequest: () => void;
};

function SuccessMessage({ protocolo, onNewRequest }: SuccessMessageProps) {
  return (
    <div role="status" className="flex flex-col gap-4 text-center">
      <p className="text-lg font-semibold text-emerald-800">Solicitação enviada!</p>
      <p className="text-sm text-neutral-700">
        As cooperativas cadastradas já podem ver o seu pedido. A cooperativa que for coletar
        vai entrar em contato pelo telefone informado.
      </p>

      <div className="rounded-lg bg-painel px-4 py-3">
        <p className="text-xs text-neutral-500">Número do protocolo</p>
        <p className="mt-1 break-all font-mono text-sm text-neutral-900">{protocolo}</p>
      </div>

      <Link
        href={`/acompanhar/${protocolo}`}
        className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
      >
        Acompanhar solicitação
      </Link>
      <p className="text-xs text-neutral-500">
        Neste aparelho, o pedido também fica em &quot;Acompanhar pedido&quot;, no
        menu. Em outro aparelho, use o número do protocolo.
      </p>

      <button
        type="button"
        onClick={onNewRequest}
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        Enviar outra solicitação
      </button>
    </div>
  );
}

type ChipProps = {
  name: string;
  value: string;
  children: ReactNode;
};

// Caixa de seleção com aparência de botão; o visual muda com `has-checked`, sem JavaScript.
function Chip({ name, value, children }: ChipProps) {
  return (
    <label className="flex min-h-11 cursor-pointer select-none flex-col items-center justify-center rounded-lg border border-campo bg-cartao px-2 py-1.5 text-center text-sm text-neutral-700 transition-colors hover:border-emerald-600 has-checked:border-emerald-700 has-checked:bg-emerald-700 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-emerald-600 has-focus-visible:ring-offset-2">
      <input type="checkbox" name={name} value={value} className="sr-only" />
      {children}
    </label>
  );
}

type SubmissionState = "idle" | "submitting" | "error";
type CepState = "idle" | "loading" | "found" | "not-found";

const cepHints: Record<CepState, string> = {
  idle: "Com o CEP, preenchemos a rua, o bairro e a cidade.",
  loading: "Buscando endereço...",
  found: "Endereço preenchido. Confira e informe o número.",
  "not-found": "Não encontramos esse CEP. Preencha o endereço abaixo.",
};

const emptyAddress = { rua: "", bairro: "", cidade: "", estado: "" };

function RequestForm({ onSent }: { onSent: (protocolo: string) => void }) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [cepState, setCepState] = useState<CepState>("idle");
  const [address, setAddress] = useState(emptyAddress);
  const numeroRef = useRef<HTMLInputElement>(null);

  function updateAddress(field: keyof typeof emptyAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  async function handleCepChange(value: string) {
    const formatted = formatCep(value);
    setCep(formatted);

    const digits = formatted.replace(/\D/g, "");

    if (digits.length !== 8) {
      setCepState("idle");
      return;
    }

    setCepState("loading");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const result = (await response.json()) as {
        erro?: boolean | string;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };

      if (!response.ok || result.erro) {
        throw new Error("CEP não encontrado");
      }

      setAddress((current) => ({
        rua: result.logradouro || current.rua,
        bairro: result.bairro || current.bairro,
        cidade: result.localidade || current.cidade,
        estado: result.uf || current.estado,
      }));
      setCepState("found");
      numeroRef.current?.focus();
    } catch {
      setCepState("not-found");
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/coletas", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        error?: string;
        id?: string;
      };

      if (!response.ok || !result.id) {
        throw new Error(result.error ?? "Não foi possível enviar os dados.");
      }

      saveRecente({
        id: result.id,
        material: formData.getAll("materiais").join(", "),
        criadoEm: new Date().toISOString(),
      });
      onSent(result.id);
    } catch (error) {
      setSubmissionState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar os dados.",
      );
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Seus dados</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className={labelClass}>
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              maxLength={fieldLimits.nome}
              autoComplete="name"
              placeholder="Ex: Maria da Silva"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="telefone" className={labelClass}>
              Telefone com DDD
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              required
              value={telefone}
              onChange={(event) => setTelefone(formatPhone(event.target.value))}
              pattern="\(\d{2}\) \d{4,5}-\d{4}"
              title="Digite o DDD e o número, por exemplo (51) 98765-4321"
              autoComplete="tel-national"
              placeholder="(51) 98765-4321"
              className={inputClass}
            />
            <p className="text-xs text-neutral-500">
              A cooperativa usa esse número para combinar a retirada.
            </p>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>O que vai descartar</h3>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>
            Tipo de material <span className="font-normal text-neutral-500">(escolha um ou mais)</span>
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {materialOptions.map((option) => (
              <Chip key={option} name="materiais" value={option}>
                {option}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Na dúvida, veja o{" "}
            <Link href="/guia-reciclagem" className="font-medium text-emerald-700 underline hover:text-emerald-800">
              Guia de Descarte
            </Link>
            .
          </p>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="materialDetalhes" className={labelClass}>
            Detalhes <span className="font-normal text-neutral-500">(opcional)</span>
          </label>
          <input
            type="text"
            id="materialDetalhes"
            name="materialDetalhes"
            maxLength={fieldLimits.materialDetalhes}
            placeholder="Ex: 2 celulares antigos e 1 monitor"
            className={inputClass}
          />
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Quando podemos buscar</h3>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>Dias</legend>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {weekDays.map((day) => (
              <Chip key={day.value} name="dias" value={day.value}>
                {day.label}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>Turnos</legend>
          <div className="grid grid-cols-3 gap-2">
            {dayPeriods.map((period) => (
              <Chip key={period.value} name="turnos" value={period.value}>
                <span className="font-medium">{period.label}</span>
                <span className="text-xs opacity-80">{period.hours}</span>
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="horarioObs" className={labelClass}>
            Observação <span className="font-normal text-neutral-500">(opcional)</span>
          </label>
          <input
            type="text"
            id="horarioObs"
            name="horarioObs"
            maxLength={fieldLimits.horarioObs}
            placeholder="Ex: depois das 14h"
            className={inputClass}
          />
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Onde buscar</h3>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cep" className={labelClass}>
            CEP <span className="font-normal text-neutral-500">(opcional)</span>
          </label>
          <input
            type="text"
            id="cep"
            name="cep"
            inputMode="numeric"
            value={cep}
            onChange={(event) => handleCepChange(event.target.value)}
            pattern="\d{5}-\d{3}"
            title="Digite os 8 números do CEP"
            autoComplete="postal-code"
            placeholder="00000-000"
            className={`${inputClass} w-40`}
          />
          <p
            aria-live="polite"
            className={`text-xs ${
              cepState === "found"
                ? "text-emerald-700"
                : cepState === "not-found"
                  ? "text-amber-700"
                  : "text-neutral-500"
            }`}
          >
            {cepHints[cepState]}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rua" className={labelClass}>
            Rua
          </label>
          <input
            type="text"
            id="rua"
            name="rua"
            required
            maxLength={fieldLimits.rua}
            value={address.rua}
            onChange={(event) => updateAddress("rua", event.target.value)}
            autoComplete="address-line1"
            placeholder="Ex: Rua dos Andradas"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="numero" className={labelClass}>
              Número
            </label>
            <input
              ref={numeroRef}
              type="text"
              id="numero"
              name="numero"
              required
              maxLength={fieldLimits.numero}
              placeholder="Ex: 123"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="complemento" className={labelClass}>
              Complemento <span className="font-normal text-neutral-500">(opcional)</span>
            </label>
            <input
              type="text"
              id="complemento"
              name="complemento"
              maxLength={fieldLimits.complemento}
              autoComplete="address-line2"
              placeholder="Apto, bloco, referência"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="bairro" className={labelClass}>
            Bairro
          </label>
          <input
            type="text"
            id="bairro"
            name="bairro"
            required
            maxLength={fieldLimits.bairro}
            value={address.bairro}
            onChange={(event) => updateAddress("bairro", event.target.value)}
            autoComplete="address-level3"
            placeholder="Ex: Centro"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cidade" className={labelClass}>
              Cidade
            </label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              required
              maxLength={fieldLimits.cidade}
              value={address.cidade}
              onChange={(event) => updateAddress("cidade", event.target.value)}
              autoComplete="address-level2"
              placeholder="Ex: Porto Alegre"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="estado" className={labelClass}>
              UF
            </label>
            <select
              id="estado"
              name="estado"
              required
              value={address.estado}
              onChange={(event) => updateAddress("estado", event.target.value)}
              autoComplete="address-level1"
              className={`${inputClass} px-2`}
            >
              <option value="" disabled>
                UF
              </option>
              {ufs.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <label className="flex items-start gap-2.5 border-t border-borda pt-5 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="consentimento"
          required
          className="mt-0.5 size-4 shrink-0 accent-emerald-700"
        />
        <span>
          Autorizo que a cooperativa responsável pela coleta veja meu nome,
          telefone e endereço para combinar a retirada.
        </span>
      </label>

      <button
        type="submit"
        disabled={submissionState === "submitting"}
        className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {submissionState === "submitting" ? "Enviando..." : "Enviar solicitação"}
      </button>

      {message && (
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
      )}
    </form>
  );
}

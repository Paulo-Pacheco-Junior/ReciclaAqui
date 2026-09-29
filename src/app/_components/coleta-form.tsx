"use client";

import { useState, type SubmitEvent } from "react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function ColetaForm() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  const [message, setMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/coletas", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Não foi possível enviar os dados.");
      }

      setSubmissionState("success");
      setMessage(result.message ?? "Dados enviados.");
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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-neutral-700">
          Informe seu nome
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          required
          placeholder="Ex: Maria da Silva"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="telefone"
          className="text-sm font-medium text-neutral-700"
        >
          Telefone para contato
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          required
          placeholder="Ex: (51) 98765-4321"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="material"
          className="text-sm font-medium text-neutral-700"
        >
          Tipo de material
        </label>
        <input
          type="text"
          id="material"
          name="material"
          required
          placeholder="Ex: Televisores, computadores, celulares, cabos, eletrodomésticos, etc."
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="horario"
          className="text-sm font-medium text-neutral-700"
        >
          Horário disponível
        </label>
        <input
          type="text"
          id="horario"
          name="horario"
          required
          placeholder="Ex: Segunda a sexta, das 14h às 18h"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="endereco"
          className="text-sm font-medium text-neutral-700"
        >
          Endereço completo
        </label>
        <textarea
          id="endereco"
          name="endereco"
          rows={3}
          required
          placeholder="Rua, número, bairro, cidade e CEP"
          className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <button
        type="submit"
        disabled={submissionState === "submitting"}
        className="mt-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {submissionState === "submitting" ? "Enviando..." : "Continuar"}
      </button>

      {message && (
        <p
          role={submissionState === "error" ? "alert" : "status"}
          className={`text-sm ${submissionState === "error" ? "text-red-700" : "text-neutral-700"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

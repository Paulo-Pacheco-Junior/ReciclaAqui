"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  className: string;
  confirmMessage?: string;
  title?: string;
};

// Fica desabilitado enquanto a ação roda, para um clique duplo não enviar duas vezes.
export function SubmitButton({ children, className, confirmMessage, title }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={title}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={`${className} disabled:cursor-wait disabled:opacity-60`}
    >
      {children}
    </button>
  );
}

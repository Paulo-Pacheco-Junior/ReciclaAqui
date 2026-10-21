import Image from "next/image";
import Link from "next/link";
import { ColetaForm } from "@/app/_components/coleta-form";

const passos = [
  "Conte o que vai descartar, quando e onde buscar.",
  "Uma cooperativa da sua região escolhe coletar e liga para combinar.",
  "Acompanhe cada etapa pelo número do protocolo.",
];

export default function Page() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:py-14">
      {/* No monitor, a apresentação fica parada à esquerda enquanto o formulário rola. */}
      <div className="text-center lg:sticky lg:top-8 lg:self-start lg:pt-6 lg:text-left">
        <Image
          src="/logo.png"
          alt="Logo ReciclaAqui"
          className="mx-auto mb-3 h-16 w-16 object-contain lg:mx-0"
          width={64}
          height={64}
        />

        <h1 className="text-3xl font-bold tracking-tight text-emerald-800 lg:text-4xl">
          EcoPonto Digital: ReciclaAqui
        </h1>
        <p className="mt-2 text-sm text-neutral-700 lg:text-base">
          Informe seus dados para alertarmos os coletores e pontos de reciclagem
          mais próximos de você.
        </p>

        <ol className="mt-8 hidden space-y-4 lg:block">
          {passos.map((passo, index) => (
            <li key={passo} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="pt-0.5 text-sm text-neutral-800">{passo}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 hidden space-y-2 text-sm lg:block">
          <p className="text-neutral-700">
            Já fez um pedido?{" "}
            <Link href="/acompanhar" className="font-medium text-emerald-800 underline hover:text-emerald-900">
              Acompanhe aqui
            </Link>
          </p>
          <p className="text-neutral-700">
            Não sabe o que pode ser descartado?{" "}
            <Link href="/guia-reciclagem" className="font-medium text-emerald-800 underline hover:text-emerald-900">
              Veja o Guia
            </Link>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-borda bg-cartao p-6 shadow-sm sm:p-8">
        <h2 className="mb-4 text-center text-lg font-semibold text-neutral-800 lg:text-left">
          Dados para a Coleta
        </h2>
        <ColetaForm />
      </div>
    </div>
  );
}

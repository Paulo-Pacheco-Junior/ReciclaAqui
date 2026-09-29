import Image from "next/image";
import { ColetaForm } from "@/app/_components/coleta-form";

export default function Page() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      {/* Cabeçalho com Logotipo e Subtítulo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center mb-3">
          <Image
            src="/logo.png"
            alt="Logo ReciclaAqui"
            className="w-16 h-16 object-contain"
            width={64}
            height={64}
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          EcoPonto Digital: ReciclaAqui
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Informe seus dados para alertarmos os coletores e pontos de reciclagem
          mais próximos de você.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800 text-center">
          Dados para a Coleta
        </h2>
        <ColetaForm />
      </div>
    </div>
  );
}

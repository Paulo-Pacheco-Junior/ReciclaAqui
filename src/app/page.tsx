export default function Page() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      {/* Cabeçalho com Logotipo e Subtítulo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center mb-3">
          <img
            src="/logo.png"
            alt="Logo ReciclaAqui"
            className="w-16 h-16 object-contain"
          />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          EcoPonto Digital: ReciclaAqui
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Informe seus dados para alertarmos os coletores e pontos de reciclagem mais próximos de você.
        </p>
      </div>

      {/* Formulário Detalhado */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800 text-center">
          Dados para a Coleta
        </h2>
        <form className="flex flex-col gap-4">
          
          {/* Nome */}
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
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Telefone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="telefone" className="text-sm font-medium text-neutral-700">
              Telefone para contato
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              required
              placeholder="Ex: (51) 98765-4321"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Tipo de Material */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="material" className="text-sm font-medium text-neutral-700">
              Tipo de material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              required
              placeholder="Ex: Televisores, computadores, celulares, cabos, eletrodomésticos, etc."
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Horário Disponível */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="horario" className="text-sm font-medium text-neutral-700">
              Horário disponível
            </label>
            <input
              type="text"
              id="horario"
              name="horario"
              required
              placeholder="Ex: Segunda a sexta, das 14h às 18h"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Endereço Completo */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="endereco" className="text-sm font-medium text-neutral-700">
              Endereço completo
            </label>
            <textarea
              id="endereco"
              name="endereco"
              rows={3}
              required
              placeholder="Rua, número, bairro, cidade e CEP"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className="mt-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
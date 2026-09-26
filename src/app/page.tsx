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
          Informe seu endereço para alertarmos os coletores e pontos de reciclagem mais próximos de você.
        </p>
      </div>

      {/* Formulário de Endereço */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800">
          Onde devemos recolher?
        </h2>
        <form className="flex flex-col gap-4">
          <textarea
            id="endereco"
            name="endereco"
            rows={4}
            required
            placeholder="Ex: Rua das Flores, 123, Bairro Verde, Cidade - CEP 00000-000"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
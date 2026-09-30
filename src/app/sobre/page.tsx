export default function SobrePage() {
  const equipe = [
    "Marlon Enric Nunes de Godoy",
    "Paulo Pacheco Júnior",
    "Rayner Ribeiro Assis dos Santos"
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Cabeçalho / Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-4">
          Nossa Missão e Propósito
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Sobre o EcoPonto Digital: <span className="text-emerald-700">ReciclaAqui!</span> ♻️
        </h1>
        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
          Transformando a conscientização ambiental e a tecnologia em ferramentas práticas para facilitar o descarte correto e promover a limpeza urbana.
        </p>
      </div>

      {/* Grid de Conteúdo Principal */}
      <div className="grid gap-10 md:grid-cols-2 mb-12">
        {/* Card 1: O Problema */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 text-xl font-bold">
                📱
              </span>
              <h2 className="text-xl font-bold text-neutral-900">O Destino do Lixo Eletrônico</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Você já parou para pensar no destino daquele celular antigo, carregador quebrado ou eletrodoméstico sem uso que temos em casa? 
            </p>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              Com o mundo cada vez mais digital, o volume de resíduos eletroeletrônicos cresce exponencialmente, gerando sérios riscos ao meio ambiente quando descartados de forma incorreta.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-100 text-xs font-medium text-amber-800 bg-amber-50/60 p-3 rounded-lg">
            ⚡ O desafio: Encontrar locais adequados e acessíveis para o descarte consciente na comunidade.
          </div>
        </div>

        {/* Card 2: A Solução */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-xl font-bold">
                🌍
              </span>
              <h2 className="text-xl font-bold text-neutral-900">Nossa Solução</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Pensando na dificuldade de encontrar locais adequados para o descarte e nos impactos disso para a nossa comunidade, estamos desenvolvendo o <strong className="text-emerald-800">EcoPonto Digital: ReciclaAqui!</strong>
            </p>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              Queremos criar uma plataforma intuitiva e eficiente para conectar cidadãos a pontos de coleta, facilitando o fluxo de reciclagem e impulsionando a economia circular e o apoio às cooperativas locais.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-emerald-100 text-xs font-medium text-emerald-800 bg-emerald-100/60 p-3 rounded-lg">
            ♻️ Foco: Limpeza urbana, sustentabilidade e inclusão social.
          </div>
        </div>
      </div>

      {/* Seção Inferior Reorganizada em Blocos Empilhados */}
      <div className="space-y-6">
        {/* Bloco da Equipe */}
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-10 shadow-lg">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <span>👥</span> Quem Faz Acontecer (Equipe)
          </h3>
          <p className="text-sm text-neutral-300 mb-6">
            O grupo para o desenvolvimento desta aplicação é formado por:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {equipe.map((membro, index) => (
              <div key={index} className="flex items-center gap-2.5 text-neutral-100 font-medium bg-neutral-800/80 px-4 py-3 rounded-xl border border-neutral-700/50">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="text-sm">{membro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco da Atividade Extensionista e IPOG (Movido para baixo em largura total) */}
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-neutral-800">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <span>🎓</span> Atividade Extensionista
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Esta plataforma inovadora faz parte da <strong className="text-white">Atividade Extensionista</strong> em nossa graduação em <strong className="text-white">Análise e Desenvolvimento de Sistemas</strong>.
            </p>
          </div>
          <div className="shrink-0 bg-neutral-800/90 border border-neutral-700/70 px-6 py-4 rounded-2xl text-right">
            <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Parceria Acadêmica</span>
            <span className="text-sm font-bold text-emerald-300">IPOG — Instituto de Pós-Graduação e Graduação</span>
          </div>
        </div>
      </div>
    </main>
  );
}
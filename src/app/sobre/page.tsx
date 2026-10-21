const equipe = [
  "Marlon Enric Nunes de Godoy",
  "Paulo Pacheco Júnior",
  "Rayner Ribeiro Assis dos Santos",
];

const passos = [
  {
    titulo: "O cidadão pede a coleta",
    texto: "Preenche o formulário com o material, os horários e o endereço.",
  },
  {
    titulo: "Uma cooperativa coleta",
    texto: "As cooperativas veem os pedidos no painel e combinam a retirada.",
  },
  {
    titulo: "Todos acompanham",
    texto: "O cidadão acompanha cada etapa pelo número do protocolo.",
  },
];

function iniciais(nome: string) {
  const partes = nome.split(" ");
  return `${partes[0][0]}${partes[partes.length - 1][0]}`;
}

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full bg-cartao/70 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-borda">
          Nossa missão e propósito
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">
          Sobre o EcoPonto Digital:{" "}
          <span className="text-emerald-700">ReciclaAqui</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-emerald-950/75">
          Transformando a conscientização ambiental e a tecnologia em ferramentas
          práticas para facilitar o descarte correto e promover a limpeza urbana.
        </p>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <section className="flex flex-col justify-between rounded-2xl bg-cartao p-8 shadow-sm ring-1 ring-borda">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-xl">
                📱
              </span>
              <h2 className="text-xl font-bold text-neutral-900">O destino do lixo eletrônico</h2>
            </div>
            <p className="leading-relaxed text-neutral-600">
              Você já parou para pensar no destino daquele celular antigo,
              carregador quebrado ou eletrodoméstico sem uso que temos em casa?
            </p>
            <p className="mt-3 leading-relaxed text-neutral-600">
              Com o mundo cada vez mais digital, o volume de resíduos
              eletroeletrônicos cresce exponencialmente, gerando sérios riscos ao
              meio ambiente quando descartados de forma incorreta.
            </p>
          </div>
          <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-900">
            O desafio: encontrar locais adequados e acessíveis para o descarte
            consciente na comunidade.
          </p>
        </section>

        <section className="flex flex-col justify-between rounded-2xl bg-cartao p-8 shadow-sm ring-1 ring-borda">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                🌍
              </span>
              <h2 className="text-xl font-bold text-neutral-900">Nossa solução</h2>
            </div>
            <p className="leading-relaxed text-neutral-600">
              Pensando na dificuldade de encontrar locais adequados para o descarte
              e nos impactos disso para a nossa comunidade, desenvolvemos o{" "}
              <strong className="text-emerald-800">EcoPonto Digital: ReciclaAqui</strong>.
            </p>
            <p className="mt-3 leading-relaxed text-neutral-600">
              Uma plataforma intuitiva para conectar cidadãos a cooperativas,
              facilitando o fluxo de reciclagem e impulsionando a economia
              circular e o apoio às cooperativas locais.
            </p>
          </div>
          <p className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
            Foco: limpeza urbana, sustentabilidade e inclusão social.
          </p>
        </section>
      </div>

      <section className="mb-6 rounded-2xl bg-cartao/60 p-8 ring-1 ring-borda">
        <h2 className="text-lg font-bold text-emerald-950">Como funciona</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {passos.map((passo, index) => (
            <li key={passo.titulo} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-neutral-900">{passo.titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{passo.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 text-white shadow-lg sm:p-10">
        <h2 className="text-lg font-semibold text-emerald-200">Quem faz acontecer</h2>
        <p className="mt-1 text-sm text-emerald-100/80">
          A equipe que desenvolveu esta aplicação:
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {equipe.map((membro) => (
            <li
              key={membro}
              className="flex items-center gap-3 rounded-xl bg-cartao/10 px-4 py-3 ring-1 ring-white/15"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-emerald-950"
              >
                {iniciais(membro)}
              </span>
              <span className="text-sm font-medium">{membro}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col justify-between gap-6 rounded-3xl bg-cartao p-8 shadow-sm ring-1 ring-borda sm:flex-row sm:items-center sm:p-10">
        <div className="max-w-2xl">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-emerald-900">
            <span aria-hidden="true">🎓</span> Atividade extensionista
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            Esta plataforma faz parte da{" "}
            <strong className="text-neutral-900">Atividade Extensionista</strong> da
            nossa graduação em{" "}
            <strong className="text-neutral-900">Análise e Desenvolvimento de Sistemas</strong>.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-emerald-50 px-6 py-4 ring-1 ring-borda sm:text-right">
          <span className="mb-1 block text-xs uppercase tracking-wider text-emerald-700">
            Parceria acadêmica
          </span>
          <span className="text-sm font-bold text-emerald-950">
            IPOG — Instituto de Pós-Graduação e Graduação
          </span>
        </div>
      </section>
    </div>
  );
}

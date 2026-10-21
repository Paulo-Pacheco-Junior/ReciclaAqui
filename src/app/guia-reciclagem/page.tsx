export default function GuiaReciclagemPage() {
  const categorias = [
    {
      titulo: "Computadores, Notebooks e Servidores",
      pode: [
        "CPUs completas, gabinetes e servidores desativados",
        "Notebooks, netbooks e ultrabooks",
        "Placas-mãe, placas de vídeo, memória RAM e processadores",
        "Fontes de alimentação e coolers/dissipadores",
        "Discos rígidos (HDs) e SSDs (recomenda-se a destruição lógica prévia)"
      ],
      dica: "Antes de descartar storages, HDs ou servidores, faça o backup e a formatação segura (wipe) para proteger dados sensíveis e corporativos."
    },
    {
      titulo: "Periféricos e Acessórios de Escritório",
      pode: [
        "Teclados e mouses (com fio ou wireless)",
        "Monitores de vídeo (LED, LCD e antigos de tubo/CRT)",
        "Impressoras, scanners e multifuncionais",
        "Webcams, microfones e fones de ouvido",
        "Roteadores, switches, modems e antenas Wi-Fi"
      ],
      dica: "Emparelhe cabos e fontes junto aos periféricos correspondentes para facilitar o processo de triagem e recondicionamento na cooperativa."
    },
    {
      titulo: "Dispositivos Móveis e Telefonia",
      pode: [
        "Smartphones, celulares corporativos e feature phones",
        "Tablets e leitores de e-reader",
        "Centrais telefônicas e aparelhos de IP/fax",
        "Smartwatches e pulseiras inteligentes"
      ],
      dica: "Remova contas de usuário (como iCloud ou Google Account) e restaure o padrão de fábrica antes de entregar seu dispositivo móvel."
    },
    {
      titulo: "Eletrônicos de Consumo (Áudio, Vídeo e Entretenimento)",
      pode: [
        "Televisores (Smart TV, LED, LCD, Plasma e Tubo)",
        "Aparelhos de som, caixas de som acústicas e soundbars",
        "Videogames (consoles antigos e modernos) e controles",
        "Aparelhos de DVD, Blu-ray, receptores de TV e conversores digitais",
        "Projetores multimídia e câmeras fotográficas/filmadoras"
      ],
      dica: "Guarde os aparelhos e seus controles remotos juntos em sacolas ou caixas para facilitar o reuso ou a doação por parte das cooperativas."
    },
    {
      titulo: "Eletrodomésticos de Pequeno e Médio Porte",
      pode: [
        "Micro-ondas e fornos elétricos de bancada",
        "Liquidificadores, batedeiras, espremedores e processadores de alimentos",
        "Cafeteiras elétricas e chaleiras",
        "Ventiladores de mesa, coluna ou teto",
        "Secadores de cabelo, pranchas e barbeadores elétricos",
        "Ferros de passar roupa e aspiradores de pó"
      ],
      dica: "Certifique-se de esvaziar o pó de aspiradores ou resíduos de alimentos dos eletroportáteis antes de realizar o descarte."
    },
    {
      titulo: "Baterias, No-breaks e Fontes de Energia",
      pode: [
        "Baterias de lítio de notebooks e celulares",
        "No-breaks (UPS) e estabilizadores de tensão",
        "Pilhas recarregáveis e baterias portáteis",
        "Carregadores de tomada, fontes de notebook e power banks"
      ],
      dica: "Isole os polos de baterias e pilhas com fita isolante antes do descarte para evitar curto-circuitos e princípios de incêndio durante o transporte."
    },
    {
      titulo: "Cabos, Conectores e Infraestrutura",
      pode: [
        "Cabos de rede (Ethernet/UTP), cabos coaxiais e fibra óptica",
        "Cabos de energia, extensões e réguas de tomadas (filtros de linha)",
        "Cabos de vídeo (HDMI, VGA, DisplayPort, DVI, USB)",
        "Racks de TI desativados e bandejas metálicas"
      ],
      dica: "Enrole os cabos de forma organizada e prenda-os com abraçadeiras ou fitas. O cobre presente neles é altamente valorizado na reciclagem!"
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-3">
          Sustentabilidade, Inclusão Social e Economia Circular
        </span>
        <h1 className="text-3xl font-bold text-neutral-900">TI Verde: Da Inovação ao Impacto Social nas Cooperativas</h1>
        <p className="mt-2 text-neutral-600 max-w-3xl leading-relaxed">
          A TI Verde vai muito além da preservação ambiental: ela impulsiona uma poderosa rede de economia circular. Quando equipamentos tecnológicos, eletrônicos e eletrodomésticos são descartados corretamente, eles chegam às cooperativas de reciclagem e passam por uma minuciosa triagem. O desmonte técnico e a separação de placas, fios de cobre e metais nobres transformam o que seria lixo em uma preciosa fonte de renda e autonomia financeira para dezenas de famílias trabalhadoras, unindo tecnologia, ecologia e justiça social.
        </p>
      </div>

      <div className="space-y-8">
        {categorias.map((cat, index) => (
          <div 
            key={index} 
            className="rounded-2xl bg-cartao p-6 shadow-sm ring-1 ring-borda"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borda pb-4 mb-4">
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">{cat.titulo}</h2>
              <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                Categoria de Resíduo
              </span>
            </div>

            {/* O que pode */}
            <div className="rounded-xl bg-painel p-5">
              <h3 className="font-semibold text-emerald-700 flex items-center gap-2 mb-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
                O que pode ser reciclado / reaproveitado:
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm text-neutral-700">
                {cat.pode.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dica Prática */}
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-borda p-3 text-xs text-neutral-700 sm:text-sm">
              <span className="shrink-0 whitespace-nowrap font-bold text-neutral-900">🌿 Boas Práticas:</span>
              <span>{cat.dica}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Importação dinâmica do mapa desativando o SSR (Server-Side Rendering)
const MapaDinamico = dynamic(() => import("./Mapa"), { ssr: false });

interface Cooperativa {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone?: string;
  lat: number;
  lng: number;
}

const cooperativas: Cooperativa[] = [
  {
    nome: "Ecoponto - Cachoeirinha RS",
    endereco: "R. Ary Rosa dos Santos, 397 - Distrito Industrial",
    cidade: "Cachoeirinha",
    estado: "RS",
    telefone: "(51) 3041-6218",
    lat: -29.9525,
    lng: -51.0910,
  },
  {
    nome: "Biorecicle Alvorada",
    endereco: "R. Baronesa do Gravataí, 103 - Maria Regina",
    cidade: "Alvorada",
    estado: "RS",
    telefone: "(51) 98648-5515",
    lat: -30.0021,
    lng: -51.0823,
  },
  {
    nome: "Ecoponto",
    endereco: "Jardim Krahe",
    cidade: "Viamão",
    estado: "RS",
    telefone: "(51) 3045-4780",
    lat: -30.0125,
    lng: -51.0255,
  },
  {
    nome: "S RECICLAGEM",
    endereco: "Av. Juca Batista, 2528 - Campo Novo",
    cidade: "Porto Alegre",
    estado: "RS",
    lat: -30.1345,
    lng: -51.2291,
  },
  {
    nome: "Ecoponto - Cachoeirinha RS",
    endereco: "R. Lindolfo Wagner, S/N - Vila Bom Principio",
    cidade: "Cachoeirinha",
    estado: "RS",
    telefone: "(51) 3041-6377",
    lat: -29.9542,
    lng: -51.0945,
  },
  {
    nome: "Coleta Voluntaria",
    endereco: "R. Diretor Augusto Pestana, 2450 - Fátima",
    cidade: "Canoas",
    estado: "RS",
    telefone: "(51) 99643-5338",
    lat: -29.9181,
    lng: -51.1782,
  },
  {
    nome: "Ecoponto Sudeste - Prefeitura de Canoas",
    endereco: "R. Paulo Fonteles (Lote João de Barro ), 9 - Niterói",
    cidade: "Canoas",
    estado: "RS",
    lat: -29.9250,
    lng: -51.1850,
  },
  {
    nome: "Ecoponto Rio Branco",
    endereco: "Rio Branco",
    cidade: "Canoas",
    estado: "RS",
    lat: -29.9200,
    lng: -51.1700,
  },
  {
    nome: "Coleta Seletiva Solidaria",
    endereco: "São Lucas",
    cidade: "Viamão",
    estado: "RS",
    lat: -30.0300,
    lng: -51.0100,
  },
  {
    nome: "COOPERTEC - Descarte de Lixo Eletrônico",
    endereco: "R. Primavera, 198 - Rio Branco",
    cidade: "Canoas",
    estado: "RS",
    telefone: "(51) 98416-9301",
    lat: -29.9215,
    lng: -51.1720,
  },
  {
    nome: "Reciclatudo Coleta Seletiva Ltda",
    endereco: "R. Gravataí, 1007 - Vila Imbui",
    cidade: "Cachoeirinha",
    estado: "RS",
    telefone: "(51) 3471-5544",
    lat: -29.9480,
    lng: -51.0850,
  },
  {
    nome: "UDC Cruzeiro do Sul (Ecoponto)",
    endereco: "R. Cruzeiro do Sul, 1445 - Santa Tereza",
    cidade: "Porto Alegre",
    estado: "RS",
    telefone: "(51) 3231-6064",
    lat: -30.0534,
    lng: -51.2189,
  },
  {
    nome: "Associação de Reciclagem Ecológica Rubem Berta",
    endereco: "Estr. Antônio Severino, 1317 - Mário Quintana",
    cidade: "Porto Alegre",
    estado: "RS",
    telefone: "(51) 3366-9522",
    lat: -30.0050,
    lng: -51.1150,
  },
  {
    nome: "Ponto de coleta seletiva e vidro",
    endereco: "R. Americana, 563 - Americana",
    cidade: "Alvorada",
    estado: "RS",
    lat: -30.0080,
    lng: -51.0750,
  },
  {
    nome: "Otser Gerenciamento De Resíduos Eletrônicos - Moinhos",
    endereco: "Moinhos de Vento",
    cidade: "Gravataí",
    estado: "RS",
    lat: -29.9450,
    lng: -50.9900,
  },
  {
    nome: "Otser Gerenciamento De Resíduos Eletrônicos - Jardim Lindoia",
    endereco: "Jardim Lindóia",
    cidade: "Porto Alegre",
    estado: "RS",
    lat: -30.0050,
    lng: -51.1550,
  },
  {
    nome: "Coleta Seletiva | COOTRAVIPA",
    endereco: "R. Conselheiro Travassos - Floresta",
    cidade: "Porto Alegre",
    estado: "RS",
    telefone: "(51) 3231-6415",
    lat: -30.0200,
    lng: -51.2100,
  },
  {
    nome: "Coleta Fácil",
    endereco: "R. Santo Alfredo, 516 - São José",
    cidade: "Porto Alegre",
    estado: "RS",
    telefone: "(51) 99721-4467",
    lat: -30.0450,
    lng: -51.1650,
  },
  {
    nome: "UDC Câncio Gomes (Ecoponto)",
    endereco: "Tv. Carmem, 111 - Moinhos de Vento",
    cidade: "Porto Alegre",
    estado: "RS",
    telefone: "(51) 3268-8330",
    lat: -30.0230,
    lng: -51.2150,
  },
  {
    nome: "UDC Princesa Isabel (Unidade de Destino Certo - Ecoponto)",
    endereco: "Av. Ipiranga, 2765 - Santana",
    cidade: "Porto Alegre",
    estado: "RS",
    telefone: "(51) 3289-6821",
    lat: -30.0455,
    lng: -51.2050,
  },
  {
    nome: "Ponto de Coleta Reciclus",
    endereco: "Passo d'Areia",
    cidade: "Porto Alegre",
    estado: "RS",
    lat: -30.0100,
    lng: -51.1680,
  },
  {
    nome: "Descarte Eletrônico | Manasses Coleta Digital",
    endereco: "R. Periata, Qd 206 - lt 27 C-2 - Parque Amazonia",
    cidade: "Goiânia",
    estado: "GO",
    lat: -16.7334,
    lng: -49.2645,
  },
  {
    nome: "Sucata eletronica Tectudo",
    endereco: "Praça C-170, 41 - Jardim América",
    cidade: "Goiânia",
    estado: "GO",
    lat: -16.7189,
    lng: -49.2812,
  },
  {
    nome: "Ecoponto Lixo Eletrônico",
    endereco: "Rua CP 4 QD CP4, LT 3 - Res. Celina Park",
    cidade: "Goiânia",
    estado: "GO",
    lat: -16.7350,
    lng: -49.3150,
  },
  {
    nome: "COISAS & COISAS - INFORMÁTICA - Ponto de coleta de lixo eletrônico!",
    endereco: "Esq - Rua 21, R. S, q62 - lt9 C4 - Vila Santa Helena",
    cidade: "Goiânia",
    estado: "GO",
    lat: -16.6700,
    lng: -49.2950,
  },
  {
    nome: "1° Ponto de Coleta de Resíduos",
    endereco: "Av. 28 de Junho - Goiânia Park Sul",
    cidade: "Aparecida de Goiânia",
    estado: "GO",
    lat: -16.7800,
    lng: -49.2450,
  },
  {
    nome: "Sucata Eletrônica Goiás",
    endereco: "Av. Brasil, Nº14 - Jardim Itaipú",
    cidade: "Goiânia",
    estado: "GO",
    lat: -16.7550,
    lng: -49.3000,
  },
  {
    nome: "CICLO VERDE - Gerenciamento de Resíduos",
    endereco: "Av. Gameleiras, 3620 - Parque Santa Maria",
    cidade: "Goiânia",
    estado: "GO",
    lat: -16.6300,
    lng: -49.1900,
  },
  {
    nome: "Descarte de lixos entulhos de obras e recicláveis grátis 24 horas",
    endereco: "R. JH-14, 185 - 1 - Jardim das Hortensias",
    cidade: "Goiânia",
    estado: "GO",
    lat: -16.6450,
    lng: -49.3300,
  },
];

export default function CooperativasPage() {
  const [busca, setBusca] = useState("");

  const cooperativasFiltradas = cooperativas.filter((item) => {
    const termo = busca.toLowerCase();
    const cidadeMatch = item.cidade.toLowerCase().includes(termo);
    const estadoMatch = item.estado.toLowerCase().includes(termo);
    const nomeMatch = item.nome.toLowerCase().includes(termo);
    return cidadeMatch || estadoMatch || nomeMatch;
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Cabeçalho / Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-4">
          Rede de Atendimento
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Cooperativas e <span className="text-emerald-700">Ecopontos</span> 📍
        </h1>
        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
          Encontre locais de descarte e cooperativas parceiras para realizar o descarte correto dos seus resíduos com segurança.
        </p>

        {/* Caixa de Pesquisa */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Pesquise por cidade (ex: Porto Alegre), estado (ex: RS) ou nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-md transition-all"
          />
        </div>
      </div>

      {/* 🗺️ MAPA INTERATIVO ISOLADO */}
      <MapaDinamico cooperativas={cooperativasFiltradas} />

      {/* Resultados em Cards */}
      {cooperativasFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center bg-white shadow-sm">
          <p className="text-neutral-500">Nenhuma cooperativa encontrada para &quot;{busca}&quot;.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {cooperativasFiltradas.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 bg-white"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-bold text-lg text-neutral-900 leading-snug">{item.nome}</h2>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100 shrink-0">
                    {item.cidade} - {item.estado}
                  </span>
                </div>
                
                <p className="text-sm text-neutral-600 flex items-start gap-2 mt-2">
                  <span className="text-emerald-600 font-semibold shrink-0">Endereço:</span> 
                  <span>{item.endereco}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-medium">Contato:</span>
                <span className={`font-semibold ${item.telefone ? "text-neutral-800" : "text-neutral-400 italic"}`}>
                  {item.telefone ? item.telefone : "Não informado"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
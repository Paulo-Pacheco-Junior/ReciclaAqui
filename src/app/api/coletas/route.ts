import {
  describeMaterial,
  describeSchedule,
  fieldLimits,
  formatCep,
  isUf,
  phoneWithCountryCode,
} from "@/lib/coleta";
import { getPrismaClient } from "@/lib/prisma";

function getText(form: FormData, name: string): string {
  const value = form.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getList(form: FormData, name: string) {
  return form.getAll(name).filter((value): value is string => typeof value === "string");
}

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return badRequest("Formato de envio inválido.");
  }

  const fields = {
    nome: getText(form, "nome"),
    telefone: getText(form, "telefone"),
    materialDetalhes: getText(form, "materialDetalhes"),
    horarioObs: getText(form, "horarioObs"),
    cep: getText(form, "cep"),
    rua: getText(form, "rua"),
    numero: getText(form, "numero"),
    complemento: getText(form, "complemento"),
    bairro: getText(form, "bairro"),
    cidade: getText(form, "cidade"),
    estado: getText(form, "estado").toUpperCase(),
  };

  const required = [
    fields.nome,
    fields.telefone,
    fields.rua,
    fields.numero,
    fields.bairro,
    fields.cidade,
    fields.estado,
  ];

  if (required.some((value) => !value)) {
    return badRequest("Preencha todos os campos obrigatórios.");
  }

  const tooLong = Object.entries(fieldLimits).some(
    ([field, limit]) => fields[field as keyof typeof fields].length > limit,
  );

  if (tooLong) {
    return badRequest("Algum campo passou do limite de caracteres.");
  }

  const material = describeMaterial(getList(form, "materiais"), fields.materialDetalhes);

  if (!material) {
    return badRequest("Escolha pelo menos um tipo de material.");
  }

  const horario = describeSchedule(
    getList(form, "dias"),
    getList(form, "turnos"),
    fields.horarioObs,
  );

  if (!horario) {
    return badRequest("Escolha pelo menos um dia e um turno para a coleta.");
  }

  if (!form.get("consentimento")) {
    return badRequest("Autorize o compartilhamento dos dados para enviar a solicitação.");
  }

  if (!isUf(fields.estado)) {
    return badRequest("Escolha uma UF válida.");
  }

  if (!phoneWithCountryCode(fields.telefone)) {
    return badRequest("Informe o telefone com DDD.");
  }

  const cepDigits = fields.cep.replace(/\D/g, "");

  if (fields.cep && cepDigits.length !== 8) {
    return badRequest("O CEP precisa ter 8 números.");
  }

  // Ex.: "Rua dos Andradas, 1000 - apto 302 - Centro Histórico - CEP 90020-000".
  const endereco = [
    `${fields.rua}, ${fields.numero}`,
    fields.complemento,
    fields.bairro,
    cepDigits && `CEP ${formatCep(cepDigits)}`,
  ]
    .filter(Boolean)
    .join(" - ");

  const data = {
    nome: fields.nome,
    telefone: fields.telefone,
    material,
    horario,
    endereco,
    cidade: fields.cidade,
    estado: fields.estado,
  };

  try {
    const coleta = await getPrismaClient().coleta.create({ data });

    return Response.json(
      {
        ok: true,
        saved: true,
        id: coleta.id,
        message: "Solicitação de coleta registrada com sucesso.",
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Não foi possível registrar a solicitação de coleta." },
      { status: 500 },
    );
  }
}

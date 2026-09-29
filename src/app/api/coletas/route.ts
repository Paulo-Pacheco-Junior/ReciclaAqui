function getText(form: FormData, name: string): string {
  const value = form.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function POST(request: Request) {
  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "Formato de envio inválido." },
      { status: 400 },
    );
  }

  const data = {
    nome: getText(form, "nome"),
    telefone: getText(form, "telefone"),
    material: getText(form, "material"),
    horario: getText(form, "horario"),
    endereco: getText(form, "endereco"),
  };

  if (Object.values(data).some((value) => !value)) {
    return Response.json(
      { error: "Preencha todos os campos obrigatórios." },
      { status: 400 },
    );
  }

  return Response.json({
    ok: true,
    saved: false,
    message: "Dados validados, mas o armazenamento ainda não foi configurado.",
  });
}

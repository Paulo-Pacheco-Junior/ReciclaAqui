import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  const pontos = await getPrismaClient().pontoColeta.findMany({
    orderBy: [{ estado: "asc" }, { cidade: "asc" }, { nome: "asc" }],
    select: {
      id: true,
      nome: true,
      endereco: true,
      cidade: true,
      estado: true,
      telefone: true,
      latitude: true,
      longitude: true,
    },
  });
  return Response.json(pontos, { headers: { "Cache-Control": "no-store" } });
}
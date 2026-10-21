import { getPrismaClient } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { cache } from "react";

// `cache` faz o header e a página dividirem a mesma consulta em cada acesso.
export const getCurrentCooperativa = cache(async () => {
  await connection();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const authUserId = data?.claims?.sub;

  if (error || typeof authUserId !== "string") {
    return null;
  }

  return getPrismaClient().cooperativa.findUnique({
    where: { authUserId },
  });
});

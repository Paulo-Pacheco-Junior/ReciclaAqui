import { getPrismaClient } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

export async function getCurrentCooperativa() {
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
}
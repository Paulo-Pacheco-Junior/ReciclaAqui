import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { cache } from "react";

export function isAdminEmail(email: string) {
  const configuredEmails = [
    ...(process.env.ADMIN_EMAILS ?? "").split(","),
    process.env.ADMIN_EMAIL ?? "",
  ]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return configuredEmails.includes(email.trim().toLowerCase());
}

export const getCurrentAdmin = cache(async () => {
  await connection();

  if (!process.env.ADMIN_EMAILS?.trim() && !process.env.ADMIN_EMAIL?.trim()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub;
  const email = claims?.email;

  if (
    error ||
    typeof userId !== "string" ||
    typeof email !== "string" ||
    !isAdminEmail(email)
  ) {
    return null;
  }

  return { userId, email };
});
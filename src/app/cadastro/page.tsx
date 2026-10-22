import { AuthForm } from "@/app/_components/auth-form";

type CadastroPageProps = {
  searchParams: Promise<{ convite?: string }>;
};

export default async function CadastroPage({ searchParams }: CadastroPageProps) {
  const { convite } = await searchParams;
  return <AuthForm mode="signup" inviteToken={convite} />;
}
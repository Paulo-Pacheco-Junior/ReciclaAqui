import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-green-800">Entrar</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Acesse sua conta ReciclaAqui
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="voce@email.com"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Sua senha"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
          >
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-600">
          <Link
            href="/"
            className="font-medium text-green-800 hover:text-green-900"
          >
            Voltar para a home
          </Link>
        </p>
      </section>
    </div>
  );
}
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="font-semibold text-lg text-emerald-600">
          Recicla Aqui
        </Link>

        {/* Navegação Principal */}
        <nav className="flex items-center gap-6 text-sm font-medium text-neutral-600">
          <Link href="/cooperativas" className="hover:text-neutral-900 transition-colors">
            Pontos de Coleta
          </Link>

          <Link href="/guia-reciclagem" className="hover:text-neutral-900 transition-colors">
            Guia de Descarte
          </Link>

          <Link href="/sobre" className="hover:text-neutral-900 transition-colors">
            Sobre nós
          </Link>
        </nav>

        {/* Autenticação */}
        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 transition-colors"
          >
            Entrar
          </Link>
          
          <Link 
            href="/cadastro" 
            className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </header>
  );
}
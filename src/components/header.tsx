import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold">
          ReciclaAqui
        </Link>
      </div>
    </header>
  );
}

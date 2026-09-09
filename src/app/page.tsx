export default function Page() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-semibold">Informe o endereço</h1>
      <form className="flex flex-col gap-4">
        <textarea
          id="endereco"
          name="endereco"
          rows={5}
          required
          placeholder="Rua, número, bairro, cidade e CEP"
          className="rounded-md border border-neutral-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-white"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}

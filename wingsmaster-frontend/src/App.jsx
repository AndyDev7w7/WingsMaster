function App() {
  const stats = [
    { label: 'Pedidos hoy', value: '0' },
    { label: 'Clientes activos', value: '0' },
    { label: 'Prods listos', value: '0' },
  ]

  return (
    <main className="min-h-screen bg-orange-50 text-zinc-900">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
            Krunchy Alitas
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">WingsMaster</h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-700">
            Base inicial para controlar usuarios, pedidos y productos sin drama.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <article
              className="rounded-lg border border-orange-200 bg-white p-5 shadow-sm"
              key={item.label}
            >
              <p className="text-sm text-zinc-500">{item.label}</p>
              <strong className="mt-2 block text-3xl">{item.value}</strong>
            </article>
          ))}
        </div>

        <button className="w-fit rounded-md bg-zinc-950 px-5 py-3 font-semibold text-white">
          Entrar al panel
        </button>
      </section>
    </main>
  )
}

export default App

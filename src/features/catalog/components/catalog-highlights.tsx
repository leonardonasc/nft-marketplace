const highlights = [
    {
        title: 'Lançamentos gênesis\nde edição limitada',
        description: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    },
    {
        title: 'Arte digital selecionada\ne muito mais',
        description: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    },
]

export default function CatalogHighlights() {
    return (
        <section aria-label="Destaques do mercado" className="mb-14 grid gap-5 md:grid-cols-2">
            {highlights.map((highlight) => (
                <article key={highlight.title} className="flex min-h-[174px] overflow-hidden rounded-md bg-[#241510]">
                    <img
                        src="/images/nft-001.png"
                        alt=""
                        className="w-[48%] object-cover"
                    />
                    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                        <h2 className="whitespace-pre-line text-xs md:text-lg font-bold leading-5 text-foreground">
                            {highlight.title}
                        </h2>
                        <p className="mt-3 text-xs md:text-sm leading-4 text-text-muted">
                            {highlight.description}
                        </p>
                        <button type="button" className="mt-3 rounded bg-primary px-3 py-1 text-[10px] font-bold text-ink">
                            Explorar →
                        </button>
                    </div>
                </article>
            ))}
        </section>
    )
}

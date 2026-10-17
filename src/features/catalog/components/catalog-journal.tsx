const articles = [
    {
        date: '12 de setembro',
        reading: 'Leitura de 6 min',
        title: 'Como funciona a propriedade de NFTs',
        description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    },
    {
        date: '13 de setembro',
        reading: 'Leitura de 2 min',
        title: '10 artistas digitais para acompanhar',
        description: 'Conheça criadores que moldam a cultura digital.',
    },
    {
        date: '15 de setembro',
        reading: 'Leitura de 3 min',
        title: 'Raridade, atributos e procedência',
        description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    },
    {
        date: '15 de setembro',
        reading: 'Leitura de 2 min',
        title: 'Como proteger sua carteira',
        description: 'Proteja sua carteira, seus ativos e sua identidade.',
    },
]

export default function CatalogJournal() {
    return (
        <section aria-labelledby="journal-title" className="mt-14 pb-8">
            <div className="mb-6 text-center">
                <h2 id="journal-title" className="text-xl font-bold text-foreground md:text-2xl">
                    Diário da Cunhagem
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                    Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {articles.map((article) => (
                    <article key={article.title} className="overflow-hidden rounded-md bg-[#241510]">
                        <img
                            src="/images/nft-001.png"
                            alt=""
                            className="aspect-[1.35] w-full object-cover"
                        />
                        <div className="p-3">
                            <p className="text-[9px] text-text-muted">
                                {article.date} <span className="mx-1">|</span> {article.reading}
                            </p>
                            <h3 className="mt-2 text-xs font-bold leading-4 text-foreground">
                                {article.title}
                            </h3>
                            <p className="mt-2 text-[9px] leading-4 text-text-muted">
                                {article.description}
                            </p>
                            <button type="button" className="mt-2 text-[9px] font-bold text-primary">
                                Ler mais →
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

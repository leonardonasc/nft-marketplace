import NftCard from '@/features/catalog/components/nft-card'
import NftTabs from '@/features/catalog/components/nft-tabs'
import { useNfts } from '../features/catalog/api'
import { Search, SlidersHorizontal, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import MobileNavbar from '@/components/mobile-navbar'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { useMemo, useState } from 'react'
import type { NftTab } from '@/features/catalog/components/nft-tabs'
import CatalogHighlights from '@/features/catalog/components/catalog-highlights'
import CatalogJournal from '@/features/catalog/components/catalog-journal'

export default function CatalogPage({ active = 'Início' }: { active?: string }) {
    const nftQuery = useNfts()
    const [activeTab, setActiveTab] = useState<NftTab>('Todos os NFTs')
    const [search, setSearch] = useState('')
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('recent')
    const pageSize = 6

    const visibleNfts = useMemo(() => {
        const items = nftQuery.data?.items ?? []
        const filtered = items.filter((nft) => `${nft.name} ${nft.collection}`.toLowerCase().includes(search.toLowerCase()))
        const sorted = [...filtered]

        if (activeTab === 'Em alta' || orderBy === 'price-desc') {
            sorted.sort((a, b) => Number(b.priceEth) - Number(a.priceEth))
        } else if (orderBy === 'price-asc') {
            sorted.sort((a, b) => Number(a.priceEth) - Number(b.priceEth))
        } else if (activeTab === 'Novos lançamentos' || orderBy === 'recent') {
            sorted.reverse()
        }

        return sorted
    }, [activeTab, nftQuery.data?.items, orderBy, search])

    const pageCount = Math.max(1, Math.ceil(visibleNfts.length / pageSize))
    const paginatedNfts = visibleNfts.slice((page - 1) * pageSize, page * pageSize)

    if (nftQuery.isLoading) {
        return (
            <main className="mx-auto min-h-screen max-w-[390px] p-6">
                <h1 className="text-amber">Discover NFTs</h1>
                <p aria-live="polite">Loading NFTs...</p>
            </main>
        )
    }

    if (nftQuery.isError) {
        return (
            <main className="mx-auto min-h-screen max-w-[390px] p-6">
                <h1>Discover NFTs</h1>
                <p role="alert">Could not load NFTs.</p>
                <button type="button" onClick={() => nftQuery.refetch()}>
                    Try again
                </button>
            </main>
        )
    }

    if (nftQuery.data?.items.length === 0) {
        return (
            <main className="mx-auto min-h-screen max-w-[390px] p-6">
                <h1>Discover NFTs</h1>
                <p>No NFTs found.</p>
            </main>
        )
    }

    return (
        <main className="mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-ink px-6 pt-8 pb-28 md:max-w-none md:px-10 md:pt-5 lg:px-16">
            <div className="mx-auto w-full max-w-7xl">
            <SiteHeader active={active} />
            <header className="mb-4">
                <div id="catalog-search" className="mb-5 flex w-full min-w-0 items-center gap-2 rounded-xl bg-surface-card px-3 py-2 text-xs text-text-muted md:hidden">
                    <Search className="size-4" />
                    <input aria-label="Explorar coleções" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-muted" placeholder="Explorar coleções" />
                    <button
                        type="button"
                        aria-label="Abrir filtros"
                        onClick={() => setFiltersOpen((value) => !value)}
                        className="ml-auto -mr-2 flex size-9 items-center justify-center rounded-xl bg-primary text-ink"
                    >
                        <SlidersHorizontal className="size-4" />
                    </button>
                </div>

                <div className="relative mb-8 h-[190px] w-full min-w-0 overflow-hidden rounded-[2rem] bg-[#271812] px-5 py-3 sm:h-[215px] sm:px-7 sm:py-4 md:h-[373px] md:rounded-none md:bg-[#160d0a] md:px-0 md:py-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(190,119,57,.48)_0_16%,transparent_16.4%),radial-gradient(circle_at_38%_8%,rgba(130,77,35,.42)_0_22%,transparent_22.4%),radial-gradient(circle_at_22%_92%,rgba(190,119,57,.34)_0_24%,transparent_24.4%),radial-gradient(circle_at_72%_78%,rgba(130,77,35,.42)_0_28%,transparent_28.4%),radial-gradient(circle_at_100%_20%,rgba(190,119,57,.28)_0_20%,transparent_20.4%)] md:hidden" />
                    <span className="pointer-events-none absolute -top-24 left-[10%] size-64 rounded-full bg-primary/20 blur-sm md:hidden" />
                    <span className="pointer-events-none absolute -bottom-32 left-[28%] size-80 rounded-full bg-[#a46737]/25 blur-sm md:hidden" />
                    <span className="pointer-events-none absolute -right-24 top-8 size-72 rounded-full bg-[#8c542d]/25 blur-sm md:hidden" />
                    <span className="pointer-events-none absolute right-[28%] -bottom-40 size-96 rounded-full bg-primary/15 blur-sm md:hidden" />
                    <div className="relative z-10 w-[54%] md:w-[52%] md:pt-5">
                        <p className="mb-3 text-[10px] text-foreground md:mb-4 md:text-xs">Bem-vindo à Kurio</p>
                        <h1 className="text-[19px] font-bold leading-[1.25] tracking-wide text-foreground sm:text-[22px] md:text-4xl md:leading-[1.6] lg:text-5xl lg:leading-[1.35]">
                            <span className="md:hidden">SEJA DONO DA CULTURA DIGITAL</span>
                            <span className="hidden md:inline">SEJA DONO DO FUTURO DA ARTE DIGITAL</span>
                        </h1>
                        <p className="mt-2 text-[10px] leading-[1.35] text-text-muted sm:text-[11px] md:mt-4 md:max-w-[440px] md:text-xs md:leading-5">
                            <span className="md:hidden">Descubra NFTs selecionados de criadores do mundo todo.</span>
                            <span className="hidden md:inline">Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.</span>
                        </p>
                        <button type="button" className="mt-1 flex items-center gap-1 text-xs font-bold text-primary md:mt-6 md:rounded md:bg-primary md:px-5 md:py-2 md:text-xs md:text-ink">
                            EXPLORAR <ArrowRight className="size-3" />
                        </button>
                    </div>
                    <img
                        src="/images/nft-001.png"
                        alt="Coleção de macacos digitais"
                        className="absolute top-3 right-3 z-0 h-[112px] w-[112px] rounded-xl object-cover sm:top-4 sm:right-4 sm:h-[135px] sm:w-[135px] md:top-0 md:right-0 md:h-[340px] md:w-[340px] md:max-h-none md:max-w-none"
                    />
                    <img
                        src="/images/nft-001.png"
                        alt="Outro NFT da coleção"
                        className="absolute right-[24%] bottom-4 z-10 size-[43px] rounded-xl object-cover shadow-lg sm:right-[25%] sm:size-[48px] md:hidden"
                    />
                    <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-8">
                        <span className="size-2 rounded-full bg-amber" />
                        <span className="size-2 rounded-full bg-amber/60" />
                        <span className="size-2 rounded-full bg-amber/60" />
                    </div>
                </div>
            </header>

            <section aria-label="NFT catalog" className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <NftTabs activeTab={activeTab} onChange={(tab) => { setActiveTab(tab); setPage(1) }} />

                    <label className="flex shrink-0 items-center gap-2 text-xs text-text-muted">
                        <span className="hidden sm:inline">Ordenar por:</span>
                        <select
                            value={orderBy}
                            onChange={(event) => { setOrderBy(event.target.value); setPage(1) }}
                            className="rounded border border-border bg-surface-card px-2 py-2 text-xs text-foreground outline-none"
                        >
                            <option value="recent">Mais recentes</option>
                            <option value="price-asc">Menor preço</option>
                            <option value="price-desc">Maior preço</option>
                        </select>
                    </label>
                </div>

                <div className="grid grid-cols-2 items-start gap-x-4 gap-y-6 md:grid-cols-[170px_1fr] lg:grid-cols-[210px_1fr]">
                    <aside className={`${filtersOpen ? 'block' : 'hidden'} rounded-sm bg-surface-card p-4 text-[10px] text-secondary md:block`}>
                        <h2 className="mb-4 font-bold text-foreground">Coleções</h2>
                        <ul className="space-y-3"><li>Arte digital <span className="float-right">(33)</span></li><li>Fotografia <span className="float-right">(12)</span></li><li>Música <span className="float-right">(65)</span></li><li>Arte 3D <span className="float-right">(39)</span></li><li>Generativa <span className="float-right">(17)</span></li><li>Jogos <span className="float-right">(19)</span></li></ul>
                        <h2 className="mt-8 mb-3 font-bold text-foreground">Faixa de preço</h2><div className="h-1 rounded bg-primary" /><p className="mt-3 text-secondary">Preço: 0,02 - 12,30 ETH</p><button className="mt-4 rounded bg-primary px-3 py-1 text-ink">Aplicar</button>

                        <h2 className="mt-8 mb-3 font-bold text-foreground">Rede</h2>
                        <ul className="space-y-3"><li>Ethereum <span className="float-right">(119)</span></li><li>Polygon <span className="float-right">(78)</span></li><li>Solana <span className="float-right">(86)</span></li></ul>

                        <div className="mt-4 overflow-hidden bg-[#241510]">
                            <h2 className="pt-4 text-center text-sm font-bold text-primary">NFT EM DESTAQUE</h2>
                            <p className="px-2 py-2 text-center text-xs font-bold text-foreground">OFERTA LIMITADA</p>
                            <img
                                src="/images/nft-001.png"
                                alt="NFT em destaque"
                                className="w-full rounded-xl object-cover"
                            />
                        </div>
                    </aside>
                    <div className="col-span-2 grid grid-cols-2 items-start gap-x-4 gap-y-6 md:col-span-1 md:grid-cols-3 md:gap-5 lg:grid-cols-3">
                    {paginatedNfts.map((nft) => (
                        <NftCard
                            key={nft.id}
                            id={nft.id}
                            imageUrl={nft.imageUrl}
                            name={nft.name}
                            priceEth={nft.priceEth}
                            isRare={nft.isRare}
                        />
                    ))}
                    {visibleNfts.length === 0 && <p className="col-span-full py-8 text-center text-xs text-text-muted">Nenhum NFT encontrado.</p>}
                    </div>
                </div>
                {pageCount > 1 && (
                    <nav aria-label="Paginação do catálogo" className="mt-8 flex items-center justify-center gap-2 md:justify-end">
                        <button type="button" aria-label="Página anterior" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="flex size-8 items-center justify-center rounded border border-border text-secondary disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`size-8 rounded text-xs ${page === pageNumber ? 'bg-primary text-ink' : 'border border-border text-secondary'}`}>{pageNumber}</button>)}
                        <button type="button" aria-label="Próxima página" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} className="flex size-8 items-center justify-center rounded border border-border text-secondary disabled:opacity-40"><ChevronRight className="size-4" /></button>
                    </nav>
                )}

                <div className="mt-12">
                    <CatalogHighlights />
                </div>
                <CatalogJournal />
            </section>
            </div>

            <SiteFooter />

            <MobileNavbar />
        </main>
    )
}
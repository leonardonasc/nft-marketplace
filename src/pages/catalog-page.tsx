import NftCard from '@/features/catalog/components/nft-card'
import NftTabs from '@/features/catalog/components/nft-tabs'
import { useNfts } from '../features/catalog/api'
import { Search, SlidersHorizontal, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import MobileNavbar from '@/components/mobile-navbar'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { NftTab } from '@/features/catalog/components/nft-tabs'
import type { NftListResponse } from '@/types/nft'
import CatalogHighlights from '@/features/catalog/components/catalog-highlights'
import CatalogJournal from '@/features/catalog/components/catalog-journal'
import { queryClient } from '@/app/query-client'
import { connectRealtime, subscribeRealtime } from '@/lib/socket'

function readCatalogUrlState() {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    const orderBy = params.get('order')
    const page = Number(params.get('page') ?? '1')

    return {
        tab: (tab === 'Novos lançamentos' || tab === 'Em alta' ? tab : 'Todos os NFTs') as NftTab,
        search: params.get('q') ?? '',
        page: Number.isInteger(page) && page > 0 ? page : 1,
        orderBy: orderBy === 'price-asc' || orderBy === 'price-desc' ? orderBy : 'recent',
        collection: params.get('collection') ?? 'Todas',
        network: params.get('network') ?? 'Todas',
        maxPrice: params.get('maxPrice') ?? '12.3',
    }
}

export default function CatalogPage({ active = 'Início' }: { active?: string }) {
    const nftQuery = useNfts()
    const initialUrlState = readCatalogUrlState()
    const [activeTab, setActiveTab] = useState<NftTab>(initialUrlState.tab)
    const [search, setSearch] = useState(initialUrlState.search)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [page, setPage] = useState(initialUrlState.page)
    const [orderBy, setOrderBy] = useState(initialUrlState.orderBy)
    const [collection, setCollection] = useState(initialUrlState.collection)
    const [network, setNetwork] = useState(initialUrlState.network)
    const [maxPrice, setMaxPrice] = useState(initialUrlState.maxPrice)
    const pageSize = 6
    const hasMounted = useRef(false)
    const restoringUrl = useRef(false)

    useEffect(() => {
        const socket = connectRealtime()
        const unsubscribe = subscribeRealtime('nft.updated', (event) => {
            queryClient.setQueriesData<NftListResponse>(
                { queryKey: ['nfts'] },
                (data) => data && {
                    ...data,
                    items: data.items.map((nft) => nft.id === event.resourceId
                        ? { ...nft, priceEth: event.priceEth, availableQuantity: event.availableQuantity }
                        : nft),
                },
            )
        })

        return () => {
            unsubscribe()
            socket?.disconnect()
        }
    }, [])

    useEffect(() => {
        const restoreFromUrl = () => {
            restoringUrl.current = true
            const next = readCatalogUrlState()
            setActiveTab(next.tab)
            setSearch(next.search)
            setPage(next.page)
            setOrderBy(next.orderBy)
            setCollection(next.collection)
            setNetwork(next.network)
            setMaxPrice(next.maxPrice)
        }

        window.addEventListener('popstate', restoreFromUrl)
        return () => window.removeEventListener('popstate', restoreFromUrl)
    }, [])

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true
            return
        }
        if (restoringUrl.current) {
            restoringUrl.current = false
            return
        }

        const params = new URLSearchParams()
        if (search) params.set('q', search)
        if (collection !== 'Todas') params.set('collection', collection)
        if (network !== 'Todas') params.set('network', network)
        if (maxPrice !== '12.3') params.set('maxPrice', maxPrice)
        if (orderBy !== 'recent') params.set('order', orderBy)
        if (activeTab !== 'Todos os NFTs') params.set('tab', activeTab)
        if (page > 1) params.set('page', String(page))
        const query = params.toString()
        window.history.pushState({}, '', query ? `${window.location.pathname}?${query}` : window.location.pathname)
    }, [activeTab, collection, maxPrice, network, orderBy, page, search])

    const visibleNfts = useMemo(() => {
        const items = nftQuery.data?.items ?? []
        const filtered = items.filter((nft) => `${nft.name} ${nft.collection}`.toLowerCase().includes(search.toLowerCase())
            && (collection === 'Todas' || nft.collection === collection)
            && (network === 'Todas' || nft.network === network)
            && Number(nft.priceEth) <= Number(maxPrice))
        const sorted = [...filtered]

        if (activeTab === 'Em alta' || orderBy === 'price-desc') {
            sorted.sort((a, b) => Number(b.priceEth) - Number(a.priceEth))
        } else if (orderBy === 'price-asc') {
            sorted.sort((a, b) => Number(a.priceEth) - Number(b.priceEth))
        } else if (activeTab === 'Novos lançamentos' || orderBy === 'recent') {
            sorted.reverse()
        }

        return sorted
    }, [activeTab, collection, maxPrice, network, nftQuery.data?.items, orderBy, search])

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
                    <div id="catalog-search" className="mb-5 flex w-full min-w-0 items-center gap-2 rounded-xl bg-surface-card px-3 py-2 text-xs text-text-muted">
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

                        {/* Fundo mobile: somente duas formas circulares cruzadas */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden">
                            <span className="absolute -left-[12%] -top-[75%] size-[280px] rounded-full bg-[#9b6137]/45" />
                            <span className="absolute -bottom-[105%] left-[18%] size-[330px] rounded-full bg-[#704323]/45" />
                        </div>

                        {/* Conteúdo */}
                        <div className="relative z-10 w-[54%] md:w-[52%] md:pt-5">
                            <p className="mb-3 text-[10px] text-foreground md:mb-4 md:text-xs">
                                Bem-vindo à Kurio
                            </p>

                            <h1 className="text-[19px] font-bold leading-[1.25] tracking-wide text-foreground sm:text-[22px] md:text-5xl md:leading-[1.6] lg:text-6xl lg:leading-[1]">
                                <span className="md:hidden">
                                    SEJA DONO DA CULTURA DIGITAL
                                </span>
                                <span className="hidden md:inline">
                                    SEJA DONO DO FUTURO DA ARTE DIGITAL
                                </span>
                            </h1>

                            <p className="mt-2 text-[10px] leading-[1.35] text-text-muted sm:text-[11px] md:mt-4 md:max-w-[640px] md:text-sm md:leading-5">
                                <span className="md:hidden">
                                    Descubra NFTs selecionados de criadores do mundo todo.
                                </span>
                                <span className="hidden md:inline">
                                    Descubra NFTs selecionados de criadores emergentes e consagrados.
                                    Colecione arte digital rara, apoie artistas e tenha uma parte da
                                    cultura da internet.
                                </span>
                            </p>

                            <button
                                type="button"
                                onClick={() => (window.location.href = "/mercado")}
                                className="mt-1 flex items-center gap-1 text-xs font-bold text-primary md:mt-6 md:rounded md:bg-primary md:px-5 md:py-2 md:text-xs md:text-ink"
                            >
                                EXPLORAR
                                <ArrowRight className="size-3" />
                            </button>
                        </div>

                        {/* Imagem principal */}
                        <img
                            src="/images/nft-001.png"
                            alt="NFT principal da coleção"
                            className="absolute right-3 top-3 z-0 size-[112px] rounded-xl object-cover sm:right-4 sm:top-4 sm:size-[135px] md:right-0 md:top-0 md:size-[340px] md:max-h-none md:max-w-none"
                        />

                        {/* Imagem secundária: encaixada no canto inferior esquerdo */}
                        <img
                            src="/images/nft-002.png"
                            alt="Outro NFT da coleção"
                            className="absolute right-[calc(12px+112px-55px)] top-[calc(12px+112px-30px)] z-10 size-[43px] rounded-xl object-cover shadow-lg sm:right-[calc(16px+135px-48px)] sm:top-[calc(16px+135px-48px)] sm:size-[48px] md:hidden"
                        />

                        {/* Indicadores */}
                        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-8">
                            <span className="size-2 rounded-full bg-amber" />
                            <span className="size-2 rounded-full bg-amber/60" />
                            <span className="size-2 rounded-full bg-amber/60" />
                        </div>
                    </div>

                </header>

                <section aria-label="NFT catalog" className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 items-start gap-x-4 gap-y-6 md:grid-cols-[170px_1fr] lg:grid-cols-[210px_1fr]">
                        <aside className={`${filtersOpen ? 'block' : 'hidden'} rounded-sm bg-surface-card p-4 text-[10px] text-secondary md:block`}>
                            <h2 className="mb-4 font-bold text-foreground text-lg">Coleções</h2>
                            <ul className="space-y-3 text-sm"><li><button type="button" onClick={() => { setCollection('Todas'); setPage(1) }} className={collection === 'Todas' ? 'text-primary' : ''}>Todas <span className="float-right">({nftQuery.data?.total ?? 0})</span></button></li>{['Rare Primates', 'Cyberpunk Chronicles', 'Cosmic Origins'].map((name) => <li key={name}><button type="button" onClick={() => { setCollection(name); setPage(1) }} className={collection === name ? 'text-primary' : ''}>{name}</button></li>)}</ul>
                            <h2 className="mt-8 mb-3 font-bold text-foreground">Faixa de preço</h2><label className="block text-secondary">Até {Number(maxPrice).toFixed(2)} ETH<input type="range" min="0.5" max="12.3" step="0.1" value={maxPrice} onChange={(event) => { setMaxPrice(event.target.value); setPage(1) }} className="mt-3 w-full accent-primary" /></label>

                            <h2 className="mt-8 mb-3 font-bold text-foreground text-lg">Rede</h2>
                            <ul className="space-y-3 text-sm">{['Todas', 'Ethereum', 'Polygon', 'Solana'].map((name) => <li key={name}><button type="button" onClick={() => { setNetwork(name); setPage(1) }} className={network === name ? 'text-primary' : ''}>{name}</button></li>)}</ul>

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
                        <div className="col-span-2 min-w-0 md:col-span-1">
                            <div className="mb-6 flex min-w-0 items-center justify-between gap-3">
                                <NftTabs
                                    activeTab={activeTab}
                                    onChange={(tab) => {
                                        setActiveTab(tab)
                                        setPage(1)
                                    }}
                                />

                                <label className="hidden shrink-0 items-center gap-2 text-xs text-text-muted md:flex">
                                    <span className="hidden lg:inline">Ordenar por:</span>
                                    <select
                                        value={orderBy}
                                        onChange={(event) => {
                                            setOrderBy(event.target.value)
                                            setPage(1)
                                        }}
                                        className="rounded border border-border bg-surface-card px-2 py-2 text-xs text-foreground outline-none"
                                    >
                                        <option value="recent">Mais recentes</option>
                                        <option value="price-asc">Menor preço</option>
                                        <option value="price-desc">Maior preço</option>
                                    </select>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 items-start gap-x-4 gap-y-6 md:grid-cols-3 md:gap-5">
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
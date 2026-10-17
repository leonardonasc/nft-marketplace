import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { nftFixtures } from '@/mocks/fixtures'
import { addToCart } from '@/lib/cart'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import MobileNavbar from '@/components/mobile-navbar'

export default function MarketPage() {
    const [added, setAdded] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [collection, setCollection] = useState('Todas')
    const [network, setNetwork] = useState('Todas')
    const [maxPrice, setMaxPrice] = useState('12.3')
    const [orderBy, setOrderBy] = useState('recent')
    const [filtersOpen, setFiltersOpen] = useState(false)

    const visibleNfts = useMemo(() => {
        const result = nftFixtures.filter((nft) => `${nft.name} ${nft.collection}`.toLowerCase().includes(search.toLowerCase())
            && (collection === 'Todas' || nft.collection === collection)
            && (network === 'Todas' || nft.network === network)
            && Number(nft.priceEth) <= Number(maxPrice))
        if (orderBy === 'price-asc') return result.sort((a, b) => Number(a.priceEth) - Number(b.priceEth))
        if (orderBy === 'price-desc') return result.sort((a, b) => Number(b.priceEth) - Number(a.priceEth))
        return result.reverse()
    }, [collection, maxPrice, network, orderBy, search])

    function handleAdd(id: string) {
        const nft = nftFixtures.find((item) => item.id === id)
        if (!nft) return
        addToCart(nft)
        setAdded(id)
    }

    return (
        <main className="min-h-screen bg-ink px-4 py-5 text-foreground md:px-10 lg:px-16">
            <SiteHeader active="Mercado" />
            <div className="mx-auto max-w-7xl">
                <p className="mb-6 text-[10px] font-bold">Início / Mercado</p>
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface-card px-3 py-3 text-xs text-text-muted">
                        <Search className="size-4" />
                        <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Explorar coleções" />
                    </div>
                    <button type="button" onClick={() => setFiltersOpen((value) => !value)} className="rounded-xl bg-primary p-3 text-ink" aria-label="Filtros"><SlidersHorizontal className="size-4" /></button>
                    <button type="button" onClick={() => (window.location.href = '/cart')} className="relative rounded-xl border border-border p-3 text-primary" aria-label="Carrinho"><ShoppingCart className="size-4" /></button>
                </div>

                <div className="grid gap-8 lg:grid-cols-[210px_1fr]">
                    <aside className={`${filtersOpen ? 'block' : 'hidden'} h-fit bg-surface-card p-4 text-xs text-secondary md:block`}>
                        <h2 className="mb-5 font-bold text-foreground">Coleções</h2>
                        {['Todas', 'Rare Primates', 'Cyberpunk Chronicles', 'Cosmic Origins'].map((item) => <button type="button" key={item} onClick={() => setCollection(item)} className={`mb-3 block ${collection === item ? 'text-primary' : ''}`}>{item}</button>)}
                        <h2 className="mt-8 mb-3 font-bold text-foreground">Faixa de preço</h2>
                        <label className="block">Até {Number(maxPrice).toFixed(2)} ETH<input type="range" min="0.5" max="12.3" step="0.1" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="mt-3 w-full accent-primary" /></label>
                        <h2 className="mt-8 mb-3 font-bold text-foreground">Rede</h2>
                        {['Todas', 'Ethereum', 'Polygon', 'Solana'].map((item) => <button type="button" key={item} onClick={() => setNetwork(item)} className={`mb-3 mr-3 ${network === item ? 'text-primary' : ''}`}>{item}</button>)}
                    </aside>

                    <section>
                        <div className="mb-5 flex items-center justify-between border-b border-border pb-3"><h1 className="font-bold">NFTs ({visibleNfts.length})</h1><select value={orderBy} onChange={(event) => setOrderBy(event.target.value)} className="rounded border border-border bg-surface-card px-2 py-2 text-xs text-secondary"><option value="recent">Mais recentes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option></select></div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {visibleNfts.map((nft, index) => (
                                <article key={nft.id} className="bg-surface-card p-2">
                                    <button type="button" className="block w-full text-left" onClick={() => (window.location.href = `/nft/${nft.id}`)}>
                                        <div className="relative"><img src={nft.imageUrl} alt={nft.name} width={1254} height={1254} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" className="aspect-square w-full rounded-xl object-cover" />{nft.isRare && <span className="absolute top-0 left-0 bg-primary px-3 py-2 text-xs font-bold text-ink">RARO</span>}</div>
                                        <h2 className="mt-2 truncate text-xs font-bold">{nft.name}</h2><p className="text-xs text-primary">{nft.priceEth} ETH</p>
                                    </button>
                                    <button type="button" onClick={() => handleAdd(nft.id)} className="mt-3 w-full rounded bg-primary py-2 text-[10px] font-bold text-ink">{added === nft.id ? 'Adicionado' : 'Adicionar ao carrinho'}</button>
                                </article>
                            ))}
                            {!visibleNfts.length && <p className="col-span-full py-8 text-center text-xs text-secondary">Nenhum NFT encontrado.</p>}
                        </div>
                    </section>
                </div>
            </div>
            <SiteFooter />
            <MobileNavbar />
        </main>
    )
}

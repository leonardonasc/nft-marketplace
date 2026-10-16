import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { nftFixtures } from '@/mocks/fixtures'
import { addToCart } from '@/lib/cart'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import MobileNavbar from '@/components/mobile-navbar'

export default function MarketPage() {
    const [added, setAdded] = useState<string | null>(null)

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
                        <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Explorar coleções" />
                    </div>
                    <button type="button" className="rounded-xl bg-primary p-3 text-ink" aria-label="Filtros"><SlidersHorizontal className="size-4" /></button>
                    <button type="button" onClick={() => (window.location.href = '/cart')} className="relative rounded-xl border border-border p-3 text-primary" aria-label="Carrinho"><ShoppingCart className="size-4" /></button>
                </div>

                <div className="grid gap-8 lg:grid-cols-[210px_1fr]">
                    <aside className="hidden h-fit bg-surface-card p-4 text-xs text-secondary md:block">
                        <h2 className="mb-5 font-bold text-foreground">Coleções</h2>
                        {['Arte digital (33)', 'Fotografia (12)', 'Música (65)', 'Arte 3D (39)', 'Colecionáveis (23)', 'Generativa (17)', 'Jogos (19)', 'Assinaturas (13)', 'Utilidade (18)'].map((item) => <p key={item} className="mb-3 flex justify-between">{item.replace(/ \(.*/, '')}<span>{item.match(/\(.+\)/)?.[0]}</span></p>)}
                        <h2 className="mt-8 mb-3 font-bold text-foreground">Faixa de preço</h2>
                        <div className="h-1 rounded bg-primary" />
                        <p className="mt-3">Preço: 0,02 - 12,30 ETH</p>
                        <button type="button" className="mt-3 rounded bg-primary px-3 py-2 font-bold text-ink">Aplicar</button>
                        <h2 className="mt-8 mb-3 font-bold text-foreground">Rede</h2>
                        {['Ethereum (119)', 'Polygon (78)', 'Solana (86)'].map((item) => <p key={item} className="mb-3 flex justify-between">{item.replace(/ \(.*/, '')}<span>{item.match(/\(.+\)/)?.[0]}</span></p>)}
                    </aside>

                    <section>
                        <div className="mb-5 flex items-center justify-between border-b border-border pb-3"><h1 className="font-bold">NFTs</h1><span className="text-xs text-secondary">Ordenar por: Mais recentes</span></div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {nftFixtures.map((nft) => (
                                <article key={nft.id} className="bg-surface-card p-2">
                                    <button type="button" className="block w-full text-left" onClick={() => (window.location.href = `/nft/${nft.id}`)}>
                                        <div className="relative"><img src={nft.imageUrl} alt={nft.name} className="aspect-square w-full rounded-xl object-cover" />{nft.isRare && <span className="absolute top-0 left-0 bg-primary px-3 py-2 text-xs font-bold text-ink">RARO</span>}</div>
                                        <h2 className="mt-2 truncate text-xs font-bold">{nft.name}</h2><p className="text-xs text-primary">{nft.priceEth} ETH</p>
                                    </button>
                                    <button type="button" onClick={() => handleAdd(nft.id)} className="mt-3 w-full rounded bg-primary py-2 text-[10px] font-bold text-ink">{added === nft.id ? 'Adicionado' : 'Adicionar ao carrinho'}</button>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <SiteFooter />
            <MobileNavbar />
        </main>
    )
}

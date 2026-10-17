import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { nftFixtures } from '@/mocks/fixtures'
import MobileNavbar from '@/components/mobile-navbar'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import RelatedNfts from '@/features/catalog/components/related-nfts'
import { useState } from 'react'
import { addToCart } from '@/lib/cart'
import FavoriteButton from '@/features/catalog/components/favorite-button'

type NftDetailPageProps = {
    id: string
}

export default function NftDetailPage({ id }: NftDetailPageProps) {
    const [quantity, setQuantity] = useState(1)
    const nft = nftFixtures.find((item) => item.id === id)

    if (!nft) {
        return <main className="min-h-screen bg-ink px-4 py-8 text-foreground"><SiteHeader active="Mercado" /><section className="mx-auto max-w-xl bg-surface-card p-10 text-center"><h1 className="font-bold">NFT não encontrado</h1><p className="mt-2 text-sm text-text-muted">Esse ativo não está disponível no catálogo.</p><button type="button" onClick={() => (window.location.href = '/mercado')} className="mt-6 rounded bg-primary px-5 py-3 text-xs font-bold text-ink">Voltar ao Mercado</button></section><SiteFooter /><MobileNavbar /></main>
    }
    const total = (Number(nft.priceEth) * quantity).toFixed(2)

    return (
        <main className="min-h-screen overflow-hidden bg-ink px-4 pt-4 pb-28 md:px-10 lg:px-16">
            <SiteHeader active="Mercado" />
            <header className="mx-auto mb-3 flex max-w-7xl items-center justify-between md:mb-6">
                <button
                    type="button"
                    aria-label="Voltar"
                    className="flex size-8 items-center justify-center rounded-full bg-surface-card text-secondary"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="size-4" />
                </button>
                <FavoriteButton nftId={nft.id} />
            </header>

            <section className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-surface-card md:grid-cols-2">
                <img src={nft.imageUrl} alt={nft.name} width={1254} height={1254} fetchPriority="high" decoding="async" className="aspect-square w-full object-cover" />

                <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-sm font-bold">{nft.name}</h1>
                        <span className="rounded-full border border-amber px-2 py-1 text-[9px] text-amber">★ 4.8(19)</span>
                    </div>

                    <p className="text-[10px] leading-4 text-text-muted">
                        Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum.
                    </p>

                    <div className="space-y-2 border-t border-border pt-2 text-[10px] text-text-muted">
                        <p><strong className="text-foreground">Edição:</strong> 1/10 &nbsp; 1/10 &nbsp; 1/50 &nbsp; ABERTA</p>
                        <p>ID do token: #{nft.id.replace('nft-', '')}</p>
                        <p>Coleção: {nft.collection}</p>
                        <p>Atributos: Óculos, Esmeralda, Raro</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3">
                        <div className="flex items-center gap-2 text-[10px]">
                            <span>Qtd.</span>
                            <button type="button" aria-label="Diminuir quantidade" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex size-8 items-center justify-center rounded-full bg-primary text-ink"><Minus className="size-3" /></button>
                            <span>{quantity}</span>
                            <button type="button" aria-label="Aumentar quantidade" disabled={quantity >= nft.availableQuantity} onClick={() => setQuantity((value) => Math.min(nft.availableQuantity, value + 1))} className="flex size-8 items-center justify-center rounded-full bg-primary text-ink"><Plus className="size-3" /></button>
                        </div>
                        <strong className="text-sm text-amber">{total} ETH</strong>
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={() => { addToCart(nft, quantity); window.location.href = '/cart' }} className="flex-1 rounded-full bg-primary py-3 text-[10px] font-bold text-ink">Comprar NFT</button>
                        <button type="button" aria-label="Adicionar ao carrinho" onClick={() => { addToCart(nft, quantity); window.location.href = '/cart' }} className="flex size-11 items-center justify-center rounded-full border border-border-soft text-amber"><ShoppingCart className="size-4" /></button>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-12 max-w-7xl border-t border-border pt-4 text-[10px] text-text-muted">
                <div className="mb-4 flex gap-8"><strong className="border-b border-primary pb-2 text-amber">Detalhes do NFT</strong><span>Avaliações de colecionadores (19)</span></div>
                <p>{nft.name} é uma obra digital 1/50 finalizada à mão da coleção {nft.collection}. Cada atributo fica registrado na blockchain e pode ser verificado na rede Ethereum.</p>
                <p className="mt-3">Rede: Ethereum com procedência imutável e metadados armazenados no IPFS.</p>
            </section>

            <RelatedNfts />
            <SiteFooter />

            <MobileNavbar />
        </main>
    )
}
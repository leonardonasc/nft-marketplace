import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { nftFixtures } from '@/mocks/fixtures'
import { getCartItems, removeFromCart, updateCartQuantity, type CartItem } from '@/lib/cart'
import MobileNavbar from '@/components/mobile-navbar'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>(getCartItems)
    const networkFee = 0.016
    const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.nft.priceEth) * item.quantity, 0), [items])

    function changeQuantity(item: CartItem, quantity: number) {
        updateCartQuantity(item.nft.id, quantity)
        setItems(getCartItems())
    }

    function removeItem(id: string) {
        removeFromCart(id)
        setItems(getCartItems())
    }

    return (
        <main className="min-h-screen bg-ink px-4 py-5 text-foreground md:px-10 lg:px-16">
            <SiteHeader active="Mercado" />
            <header className="mx-auto flex max-w-7xl items-center gap-3 md:hidden"><button onClick={() => window.history.back()} aria-label="Voltar" className="rounded-full bg-surface-card p-2 text-secondary"><ArrowLeft className="size-4" /></button><h1 className="text-lg font-bold">Carrinho de NFTs</h1></header>
            <div className="mx-auto max-w-7xl">
                <p className="mb-2 text-[10px] font-bold">Início / Mercado / Carrinho</p>
                <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                    <section className="space-y-2">
                        <div className="hidden grid-cols-[1fr_100px_100px_100px] border-b border-border px-4 pb-2 text-xs text-secondary md:grid"><span>NFTs</span><span>Preço</span><span>Edições</span><span>Total</span></div>
                        {items.length === 0 && <div className="rounded-lg bg-surface-card p-8 text-center text-xs text-text-muted">Seu carrinho está vazio. Adicione NFTs no Mercado.</div>}
                        {items.map((item) => {
                            const { nft, quantity } = item
                            return <article key={nft.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-lg bg-surface-card p-2 md:grid-cols-[64px_1fr_100px_100px_100px] md:p-3">
                                <img src={nft.imageUrl} alt={nft.name} className="size-14 rounded-md object-cover" />
                                <div><h2 className="text-xs font-bold">{nft.name}</h2><p className="text-[9px] text-text-muted">ID do token: #{nft.id.replace('nft-', '')}</p></div>
                                <span className="text-xs text-amber">{nft.priceEth} ETH</span>
                                <div className="flex items-center gap-2 text-xs"><button type="button" aria-label="Diminuir quantidade" disabled={quantity === 1} onClick={() => changeQuantity(item, quantity - 1)} className="rounded-full bg-primary px-1 text-ink"><Minus className="size-3" /></button>{quantity}<button type="button" aria-label="Aumentar quantidade" disabled={quantity >= nft.availableQuantity} onClick={() => changeQuantity(item, quantity + 1)} className="rounded-full bg-primary px-1 text-ink"><Plus className="size-3" /></button></div>
                                <div className="flex items-center gap-2 text-xs text-amber">{(Number(nft.priceEth) * quantity).toFixed(2)} ETH <button type="button" aria-label={`Remover ${nft.name}`} onClick={() => removeItem(nft.id)}><Trash2 className="size-3 text-secondary" /></button></div>
                            </article>
                        })}
                    </section>
                    <aside className="h-fit rounded-xl p-0 lg:pl-2">
                        <h2 className="mb-5 font-bold">Resumo da carteira</h2>
                        <div className="flex"><input className="input-kurio min-w-0 flex-1" placeholder="Digite o código promocional..." /><button className="rounded-r bg-primary px-4 text-xs font-bold text-ink">Aplicar</button></div>
                        <dl className="mt-5 space-y-3 text-xs"><div className="flex justify-between"><dt>Subtotal</dt><dd>{subtotal.toFixed(2)} ETH</dd></div><div className="flex justify-between"><dt>Desconto do lançamento</dt><dd>(-) 00.00</dd></div><div className="flex justify-between"><dt>Taxa de rede</dt><dd>{subtotal ? networkFee.toFixed(3) : '0.000'} ETH</dd></div><div className="flex justify-between border-t border-border pt-3 font-bold"><dt>Total</dt><dd className="text-amber">{(subtotal ? subtotal + networkFee : 0).toFixed(3)} ETH</dd></div></dl>
                        <button disabled={!items.length} onClick={() => (window.location.href = '/checkout')} className="mt-6 w-full rounded-md bg-primary py-3 text-xs font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40">Conectar e finalizar</button>
                        <button type="button" onClick={() => (window.location.href = '/mercado')} className="mt-3 w-full text-xs text-primary">Continuar explorando</button>
                    </aside>
                </div>
            </div>
            <section className="mx-auto mt-20 max-w-7xl"><h2 className="border-b border-border pb-2 text-xs font-bold text-primary">Colecionadores também viram</h2><div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">{nftFixtures.slice(4, 9).map((nft) => <button key={nft.id} type="button" onClick={() => (window.location.href = `/nft/${nft.id}`)} className="min-w-0 text-left"><div className="bg-surface-card p-2"><img src={nft.imageUrl} alt={nft.name} className="aspect-square w-full rounded-xl object-cover" /></div><h3 className="mt-2 truncate text-[10px]">{nft.name}</h3><p className="text-xs font-bold text-amber">{nft.priceEth} ETH</p></button>)}</div></section>
            <SiteFooter /><MobileNavbar />
        </main>
    )
}

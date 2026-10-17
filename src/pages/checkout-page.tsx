import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getCartItems, type CartItem } from '@/lib/cart'
import { createOrder } from '@/lib/orders'
import MobileNavbar from '@/components/mobile-navbar'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'

export default function CheckoutPage() {
    const [wallet, setWallet] = useState('metamask')
    const items = useMemo<CartItem[]>(() => getCartItems(), [])
    const subtotal = items.reduce((sum, item) => sum + Number(item.nft.priceEth) * item.quantity, 0)
    const fee = items.length ? 0.016 : 0

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const order = createOrder(items, wallet)
        localStorage.removeItem('kurio_cart')
        window.dispatchEvent(new Event('kurio-cart-updated'))
        window.location.href = `/confirmation?order=${order.id}`
    }

    if (!items.length) {
        return <main className="min-h-screen bg-ink px-4 py-5 text-foreground"><SiteHeader active="Mercado" /><section className="mx-auto max-w-xl rounded-xl bg-surface-card p-10 text-center"><h1 className="font-bold">Seu checkout está vazio</h1><p className="mt-3 text-sm text-text-muted">Adicione um NFT ao carrinho para continuar.</p><button type="button" onClick={() => (window.location.href = '/mercado')} className="mt-6 rounded bg-primary px-5 py-3 text-xs font-bold text-ink">Ir para o Mercado</button></section><SiteFooter /><MobileNavbar /></main>
    }

    return <main className="min-h-screen bg-ink px-4 py-5 text-foreground md:px-10 lg:px-16">
        <SiteHeader active="Mercado" />
        <header className="mx-auto flex max-w-7xl items-center gap-4 md:hidden"><button onClick={() => window.history.back()} className="rounded-full bg-surface-card p-2 text-secondary"><ArrowLeft className="size-4" /></button><h1 className="font-bold">Pagamento com carteira</h1></header>
        <form className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[1.5fr_1fr]" onSubmit={handleSubmit}>
            <div className="grid content-start gap-3 md:grid-cols-2"><h2 className="col-span-full font-bold">Perfil de colecionador</h2>{['Nome de exibição', 'Nome de usuário', 'Rede', 'Nome do perfil', 'Endereço da carteira', 'ENS ou carteira secundária', 'Tipo de carteira', 'Código de indicação', 'E-mail'].map((label) => <input required key={label} className="input-kurio" placeholder={`${label}*`} />)}<textarea className="input-kurio col-span-full min-h-24" placeholder="Observação do colecionador (opcional)" /></div>
            <section className="rounded-xl bg-surface-card p-5"><h2 className="font-bold">Seus NFTs</h2><div className="mt-4 space-y-2">{items.map(({ nft, quantity }) => <div key={nft.id} className="flex items-center justify-between gap-3 rounded bg-surface-raised p-2 text-xs"><span className="flex items-center gap-2"><img src={nft.imageUrl} alt="" className="size-9 rounded object-cover" />{nft.name} (x {quantity})</span><strong className="text-amber">{(Number(nft.priceEth) * quantity).toFixed(2)} ETH</strong></div>)}</div><h2 className="mt-6 font-bold">Carteira e rede</h2><div className="mt-5 space-y-2">{['WalletConnect', 'MetaMask', 'Coinbase Wallet'].map((name) => <button type="button" key={name} onClick={() => setWallet(name.toLowerCase())} className={`flex w-full items-center justify-between rounded-lg border p-3 text-xs ${wallet === name.toLowerCase() ? 'border-primary text-primary' : 'border-border'}`}><span>{name}</span><CheckCircle2 className="size-4" /></button>)}</div><div className="mt-6 flex justify-between border-t border-border pt-4 font-bold">Total <span className="text-amber">{(subtotal + fee).toFixed(3)} ETH</span></div><button type="submit" className="mt-8 w-full rounded-md bg-primary py-3 text-xs font-bold text-ink">Confirmar compra</button></section>
        </form><SiteFooter /><MobileNavbar />
    </main>
}

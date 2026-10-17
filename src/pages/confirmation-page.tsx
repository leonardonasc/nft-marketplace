import { Check, X } from 'lucide-react'
import SiteFooter from '@/components/site-footer'
import { getLastOrder, getOrder, type Order } from '@/lib/orders'

export default function ConfirmationPage() {
    const orderId = new URLSearchParams(window.location.search).get('order')
    const order = orderId ? getOrder(orderId) : getLastOrder()

    if (!order) {
        return <main className="min-h-screen bg-ink px-4 py-8 text-foreground"><section className="mx-auto max-w-130 bg-surface-card p-8 text-center"><h1 className="font-bold">Pedido não encontrado</h1><button type="button" onClick={() => (window.location.href = '/mercado')} className="mt-5 rounded-md bg-primary px-5 py-3 text-xs font-bold text-ink">Voltar ao Mercado</button></section><SiteFooter /></main>
    }

    return <main className="min-h-screen bg-ink px-4 py-8 text-foreground"><section className="mx-auto w-full max-w-130 border-b-4 border-primary bg-surface-card p-6 md:p-8"><button type="button" onClick={() => (window.location.href = '/')} className="float-right text-amber" aria-label="Fechar"><X className="size-4" /></button><div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-primary text-primary"><Check /></div><h1 className="mt-5 text-center font-bold">Seus NFTs agora estão na sua carteira</h1><div className="mt-6 grid grid-cols-2 gap-3 border-y border-border py-3 text-[10px] text-secondary md:grid-cols-4"><span>ID da transação<br /><b className="text-foreground">{order.transactionId}</b></span><span>Data<br /><b className="text-foreground">{formatDate(order)}</b></span><span>Total<br /><b className="text-foreground">{order.total.toFixed(3)} ETH</b></span><span>Carteira<br /><b className="text-foreground">{order.wallet}</b></span></div><h2 className="mt-6 font-bold">Detalhes da transação</h2><div className="mt-3 space-y-3">{order.items.map(({ nft, quantity }) => <div key={nft.id} className="flex items-center gap-3"><img src={nft.imageUrl} alt={nft.name} className="size-12 rounded-md object-cover" /><div className="flex-1 text-xs"><strong>{nft.name}</strong><p className="text-text-muted">Quantidade: {quantity}</p></div><strong className="text-amber">{(Number(nft.priceEth) * quantity).toFixed(2)} ETH</strong></div>)}</div><p className="mt-6 border-t border-border pt-4 text-center text-xs text-text-muted">Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.</p><button type="button" onClick={() => window.open(`https://etherscan.io/tx/${order.transactionId}`, '_blank')} className="mx-auto mt-5 block rounded-md bg-primary px-5 py-3 text-xs font-bold text-ink">Ver no Etherscan</button></section><SiteFooter /></main>
}

function formatDate(order: Order) {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(order.createdAt))
}

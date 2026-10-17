import { Search, ShoppingCart, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCartCount } from '@/lib/cart'
import { clearSession, getSession, type Session } from '@/lib/auth'

export default function SiteHeader({ active = 'Mercado' }: { active?: string }) {
    const [cartCount, setCartCount] = useState(0)
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        const update = () => setCartCount(getCartCount())
        update()
        const updateSession = () => setSession(getSession())
        updateSession()
        window.addEventListener('kurio-cart-updated', update)
        window.addEventListener('storage', update)
        window.addEventListener('kurio-session-changed', updateSession)
        return () => {
            window.removeEventListener('kurio-cart-updated', update)
            window.removeEventListener('storage', update)
            window.removeEventListener('kurio-session-changed', updateSession)
        }
    }, [])

    const items = [
        ['Início', '/'],
        ['Mercado', '/mercado'],
        ['Criadores', '/creators'],
        ['Aprenda', '/learn'],
    ] as const

    return (
        <header className="mx-auto mb-8 flex h-16 w-full max-w-7xl items-center justify-between border-b border-border text-sm md:h-14 md:text-[13px]">
            <button type="button" className="font-bold tracking-[0.2em]" onClick={() => (window.location.href = '/')}>KURIO</button>
            <nav className="hidden h-full items-center gap-10 text-secondary md:flex">
                {items.map(([label, path]) => (
                    <button key={label} type="button" onClick={() => (window.location.href = path)} className={active === label ? 'relative flex h-full items-center text-primary after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5 after:bg-primary' : 'flex h-full items-center'}>{label}</button>
                ))}
            </nav>
            <div className="flex items-center gap-3 md:gap-4">
                <button type="button" aria-label="Pesquisar" onClick={() => { window.location.href = '/#catalog-search' }}><Search className="size-5 md:size-4" /></button>
                <button type="button" aria-label={`Carrinho${cartCount ? `, ${cartCount} itens` : ''}`} onClick={() => (window.location.href = '/cart')} className="relative"><ShoppingCart className="size-5 md:size-4" />{cartCount > 0 && <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-ink">{cartCount}</span>}</button>
                <button type="button" onClick={() => session ? clearSession() : (window.location.href = '/login')} className="rounded bg-primary px-4 py-2 text-xs text-ink md:text-[12px]"><UserRound className="mr-1 inline size-3" /> {session ? session.username : 'Entrar'}</button>
            </div>
        </header>
    )
}

import { Search, ShoppingCart, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCartCount } from '@/lib/cart'
import { getSession, type Session } from '@/lib/auth'

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
        <header className="mx-auto mb-6 flex h-14 w-full max-w-7xl items-center justify-between gap-3 border-b border-border text-xs sm:mb-8 sm:h-16 md:mb-6 md:h-14 md:gap-4 md:text-[12px] lg:gap-8 lg:text-[13px]">
            <button type="button" className="shrink-0 font-bold tracking-[0.16em] sm:tracking-[0.2em]" onClick={() => (window.location.href = '/')}>KURIO</button>
            <nav className="hidden h-full min-w-0 items-center gap-5 text-secondary md:flex lg:gap-8">
                {items.map(([label, path]) => (
                    <button key={label} type="button" onClick={() => (window.location.href = path)} className={active === label ? 'relative flex h-full items-center text-primary after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5 after:bg-primary' : 'flex h-full items-center'}>{label}</button>
                ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-2 lg:gap-4">
                <button type="button" aria-label="Pesquisar" className="flex size-8 items-center justify-center md:size-7" onClick={() => { window.location.href = '/#catalog-search' }}>
                    <Search className="size-4 sm:size-5 md:size-4" />
                </button>
                <button type="button" aria-label={`Carrinho${cartCount ? `, ${cartCount} itens` : ''}`} onClick={() => (window.location.href = '/cart')} className="relative flex size-8 items-center justify-center md:size-7">
                    <ShoppingCart className="size-4 sm:size-5 md:size-4" />{cartCount > 0 &&
                        <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-ink">{cartCount}</span>
                    }
                </button>
                <button type="button" onClick={() => (window.location.href = session ? '/account' : '/login')} className="flex min-w-0 max-w-[104px] items-center rounded bg-primary px-2.5 py-1.5 text-[10px] text-ink sm:max-w-[150px] sm:px-3 sm:py-2 sm:text-xs md:max-w-[130px] md:px-2.5 md:py-1.5 md:text-[11px] lg:max-w-[180px] lg:px-3 lg:text-xs">
                    <UserRound className="mr-1 size-3 shrink-0" />
                    <span className="truncate">{session ? session.username : 'Entrar'}</span>
                </button>
            </div>
        </header>
    )
}

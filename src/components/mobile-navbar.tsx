import { Heart, Home, ScanLine, ShoppingCart, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { getCartCount } from '@/lib/cart'

export default function MobileNavbar() {
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        const update = () => setCartCount(getCartCount())
        update()
        window.addEventListener('kurio-cart-updated', update)
        window.addEventListener('storage', update)
        return () => {
            window.removeEventListener('kurio-cart-updated', update)
            window.removeEventListener('storage', update)
        }
    }, [])
    return (
        <nav
            aria-label="Navegação principal"
            className="fixed bottom-3 left-1/2 z-30 flex h-[70px] w-[calc(100%-2rem)] max-w-[374px] -translate-x-1/2 items-center justify-around rounded-3xl bg-surface-card px-5 text-secondary shadow-2xl md:hidden"
        >
            <button type="button" aria-label="Início" className="text-primary" onClick={() => (window.location.href = '/')}>
                <Home className="size-5 fill-current" />
            </button>
            <button type="button" aria-label="Favoritos" onClick={() => (window.location.href = '/favorites')}>
                <Heart className="size-5 fill-current" />
            </button>
            <button type="button" aria-label="Criar ou escanear NFT" onClick={() => (window.location.href = '/creators')} className="-mt-8 flex size-14 items-center justify-center rounded-full border-4 border-ink bg-primary text-ink shadow-lg">
                <ScanLine className="size-6" />
            </button>
            <button type="button" aria-label="Compras" onClick={() => (window.location.href = '/cart')} className="relative">
                <ShoppingCart className="size-5 fill-current" />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-ink">{cartCount}</span>}
            </button>
            <button type="button" aria-label="Perfil" onClick={() => (window.location.href = '/login')}>
                <UserRound className="size-5 fill-current" />
            </button>
        </nav>
    )
}
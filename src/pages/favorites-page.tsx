import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import MobileNavbar from '@/components/mobile-navbar'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
import NftCard from '@/features/catalog/components/nft-card'
import { getFavorites } from '@/lib/favorites'
import { nftFixtures } from '@/mocks/fixtures'

export default function FavoritesPage() {
    const [favoriteIds, setFavoriteIds] = useState(getFavorites)
    const favorites = nftFixtures.filter((nft) => favoriteIds.includes(nft.id))

    useEffect(() => {
        const update = () => setFavoriteIds(getFavorites())
        window.addEventListener('kurio-favorites-changed', update)
        window.addEventListener('storage', update)
        return () => {
            window.removeEventListener('kurio-favorites-changed', update)
            window.removeEventListener('storage', update)
        }
    }, [])

    return <main className="min-h-screen bg-ink px-4 py-5 pb-28 text-foreground md:px-10 lg:px-16">
        <SiteHeader active="Mercado" />
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center gap-3"><Heart className="size-5 text-primary" /><div><p className="text-[10px] font-bold text-primary">SUA COLEÇÃO</p><h1 className="text-2xl font-bold">Favoritos</h1></div></div>
            {favorites.length === 0 ? <section className="rounded-xl bg-surface-card p-12 text-center"><Heart className="mx-auto size-8 text-text-muted" /><h2 className="mt-4 font-bold">Nenhum favorito ainda</h2><p className="mt-2 text-sm text-text-muted">Salve NFTs que você quer acompanhar para encontrá-los aqui.</p><button type="button" onClick={() => (window.location.href = '/mercado')} className="mt-6 rounded bg-primary px-5 py-3 text-xs font-bold text-ink">Explorar o Mercado</button></section> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{favorites.map((nft) => <NftCard key={nft.id} id={nft.id} imageUrl={nft.imageUrl} name={nft.name} priceEth={nft.priceEth} isRare={nft.isRare} />)}</div>}
        </div>
        <SiteFooter />
        <MobileNavbar />
    </main>
}

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { isFavorite, toggleFavorite } from '@/lib/favorites'

export default function FavoriteButton({ nftId, hideWhenInactive = false }: { nftId: string; hideWhenInactive?: boolean }) {
    const [favorite, setFavorite] = useState(false)

    useEffect(() => {
        const updateFavorite = () => setFavorite(isFavorite(nftId))

        updateFavorite()
        window.addEventListener('kurio-favorites-changed', updateFavorite)
        window.addEventListener('storage', updateFavorite)

        return () => {
            window.removeEventListener('kurio-favorites-changed', updateFavorite)
            window.removeEventListener('storage', updateFavorite)
        }
    }, [nftId])

    if (hideWhenInactive && !favorite) return null

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            onClick={(event) => {
                event.stopPropagation()
                setFavorite(toggleFavorite(nftId))
            }}
        >
            <Heart className={`rounded-full border border-border-soft p-1 size-8 ${favorite ? ' text-amber bg-border' : ''}`} />
        </Button>
    )
}

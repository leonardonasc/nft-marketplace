import { migrateLegacyStorage, scopedStorageKey } from './storage'

const FAVORITES_KEY = 'kurio-favorites'

export function getFavorites(): string[] {
    if (typeof window === 'undefined') return []
    migrateLegacyStorage(FAVORITES_KEY)

    try {
        const value = window.localStorage.getItem(scopedStorageKey(FAVORITES_KEY))
        return value ? JSON.parse(value) : []
    } catch {
        return []
    }
}

export function isFavorite(id: string): boolean {
    return getFavorites().includes(id)
}

export function toggleFavorite(id: string): boolean {
    const favorites = getFavorites()
    const nextIsFavorite = !favorites.includes(id)
    const nextFavorites = nextIsFavorite
        ? [...favorites, id]
        : favorites.filter((favoriteId) => favoriteId !== id)

    window.localStorage.setItem(scopedStorageKey(FAVORITES_KEY), JSON.stringify(nextFavorites))
    window.dispatchEvent(new Event('kurio-favorites-changed'))

    return nextIsFavorite
}

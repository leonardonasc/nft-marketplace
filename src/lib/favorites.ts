const FAVORITES_KEY = 'kurio-favorites'

export function getFavorites(): string[] {
    if (typeof window === 'undefined') return []

    try {
        const value = window.localStorage.getItem(FAVORITES_KEY)
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

    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites))
    window.dispatchEvent(new Event('kurio-favorites-changed'))

    return nextIsFavorite
}

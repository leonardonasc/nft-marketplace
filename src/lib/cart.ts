import type { Nft } from '@/types/nft'
import { nftFixtures } from '@/mocks/fixtures'

export type CartItem = {
    nft: Nft
    quantity: number
}

const CART_KEY = 'kurio_cart'

export function getCartItems(): CartItem[] {
    if (typeof window === 'undefined') return []

    try {
        const stored = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as Array<{ nftId: string; quantity: number }>
        return stored.flatMap(({ nftId, quantity }) => {
            const nft = requireNft(nftId)
            return nft && quantity > 0 ? [{ nft, quantity }] : []
        })
    } catch {
        return []
    }
}

export function addToCart(nft: Nft, quantity = 1) {
    const items = getCartItems()
    const existing = items.find((item) => item.nft.id === nft.id)

    if (existing) {
        existing.quantity = Math.min(nft.availableQuantity, existing.quantity + quantity)
    } else {
        items.push({ nft, quantity: Math.min(nft.availableQuantity, quantity) })
    }

    saveCart(items)
}

export function removeFromCart(nftId: string) {
    saveCart(getCartItems().filter((item) => item.nft.id !== nftId))
}

export function updateCartQuantity(nftId: string, quantity: number) {
    saveCart(getCartItems().map((item) => item.nft.id === nftId
        ? { ...item, quantity: Math.min(item.nft.availableQuantity, quantity) }
        : item).filter((item) => item.quantity > 0))
}

export function getCartCount() {
    return getCartItems().reduce((total, item) => total + item.quantity, 0)
}

function saveCart(items: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items.map(({ nft, quantity }) => ({ nftId: nft.id, quantity }))))
    window.dispatchEvent(new Event('kurio-cart-updated'))
}

function requireNft(id: string): Nft | undefined {
    return nftFixtures.find((nft) => nft.id === id)
}

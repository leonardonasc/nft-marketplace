import { apiClient } from './api-client'
import type { CartItem } from './cart'

export type QuoteResponse = {
    subtotal: string
    discount: string
    networkFee: string
    total: string
    coupon: string | null
}

export async function quoteCart(items: CartItem[], coupon = '') {
    const { data } = await apiClient.post<QuoteResponse>('/quotes', {
        items: items.map(({ nft, quantity }) => ({ nftId: nft.id, quantity })),
        coupon: coupon.trim() || undefined,
    })
    return data
}
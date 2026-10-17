import type { CartItem } from './cart'
import { apiClient } from './api-client'
import { migrateLegacyStorage, scopedStorageKey } from './storage'

export type Order = {
    id: string
    status: 'pending' | 'confirmed' | 'rejected'
    createdAt: string
    wallet: string
    items: CartItem[]
    subtotal: number
    fee: number
    total: number
    transactionId: string
}

const ORDERS_KEY = 'kurio_orders'
const LAST_ORDER_KEY = 'kurio_last_order'

export async function createOrder(items: CartItem[], wallet: string): Promise<Order> {
    const idempotencyKey = createId()
    const { data: order } = await apiClient.post<Order>('/orders', {
        wallet,
        items: items.map(({ nft, quantity }) => ({ nftId: nft.id, quantity })),
    }, {
        headers: { 'Idempotency-Key': idempotencyKey },
    })

    const orders = getOrders()
    localStorage.setItem(scopedStorageKey(ORDERS_KEY), JSON.stringify([...orders, order]))
    localStorage.setItem(scopedStorageKey(LAST_ORDER_KEY), order.id)
    return order
}

export function getOrder(id: string): Order | null {
    return getOrders().find((order) => order.id === id) ?? null
}

export function getLastOrder(): Order | null {
    migrateLegacyStorage(LAST_ORDER_KEY)
    const id = localStorage.getItem(scopedStorageKey(LAST_ORDER_KEY))
    return id ? getOrder(id) : null
}

function getOrders(): Order[] {
    if (typeof window === 'undefined') return []
    migrateLegacyStorage(ORDERS_KEY)

    try {
        return JSON.parse(localStorage.getItem(scopedStorageKey(ORDERS_KEY)) ?? '[]') as Order[]
    } catch {
        return []
    }
}

function createId() {
    return typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

import type { CartItem } from './cart'

export type Order = {
    id: string
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

export function createOrder(items: CartItem[], wallet: string): Order {
    const subtotal = items.reduce((sum, item) => sum + Number(item.nft.priceEth) * item.quantity, 0)
    const fee = items.length ? 0.016 : 0
    const order: Order = {
        id: createId(),
        createdAt: new Date().toISOString(),
        wallet,
        items: items.map((item) => ({ ...item })),
        subtotal,
        fee,
        total: subtotal + fee,
        transactionId: `0x${createId().replaceAll('-', '').slice(0, 12).toUpperCase()}`,
    }

    const orders = getOrders()
    localStorage.setItem(ORDERS_KEY, JSON.stringify([...orders, order]))
    localStorage.setItem(LAST_ORDER_KEY, order.id)
    return order
}

export function getOrder(id: string): Order | null {
    return getOrders().find((order) => order.id === id) ?? null
}

export function getLastOrder(): Order | null {
    const id = localStorage.getItem(LAST_ORDER_KEY)
    return id ? getOrder(id) : null
}

function getOrders(): Order[] {
    if (typeof window === 'undefined') return []

    try {
        return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]') as Order[]
    } catch {
        return []
    }
}

function createId() {
    return typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

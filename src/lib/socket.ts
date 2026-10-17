import { io, type Socket } from 'socket.io-client'

export type NftUpdatedEvent = {
    resourceId: string
    version: number
    priceEth: string
    availableQuantity: number
}

export type OrderUpdatedEvent = {
    resourceId: string
    version: number
    status: 'pending' | 'confirmed' | 'rejected'
}

type RealtimeEvents = {
    'nft.updated': (event: NftUpdatedEvent) => void
    'order.updated': (event: OrderUpdatedEvent) => void
}

let socket: Socket | null = null
const latestVersions = new Map<string, number>()

export function connectRealtime(): Socket | null {
    if (socket) return socket

    const realtimeUrl = import.meta.env.VITE_REALTIME_URL || (import.meta.env.DEV ? window.location.origin : '')
    if (!realtimeUrl) return null

    socket = io(realtimeUrl, {
        path: '/socket.io',
        transports: ['websocket'],
        autoConnect: true,
    })

    socket.on('connect', () => socket?.emit('subscribe'))

    for (const eventName of ['nft.updated', 'order.updated'] as const) {
        socket.on(eventName, (event: RealtimeEvents[typeof eventName] extends (payload: infer Payload) => void ? Payload : never) => {
            const versionKey = `${eventName}:${event.resourceId}`
            const latestVersion = latestVersions.get(versionKey) ?? 0
            if (event.version <= latestVersion) return
            latestVersions.set(versionKey, event.version)
            window.dispatchEvent(new CustomEvent(eventName, { detail: event }))
        })
    }

    return socket
}

export function subscribeRealtime<EventName extends keyof RealtimeEvents>(eventName: EventName, listener: RealtimeEvents[EventName]) {
    const eventListener = (event: Event) => (listener as (payload: unknown) => void)((event as CustomEvent).detail)
    window.addEventListener(eventName, eventListener)
    return () => window.removeEventListener(eventName, eventListener)
}

export function disconnectRealtime() {
    socket?.disconnect()
    socket = null
    latestVersions.clear()
}

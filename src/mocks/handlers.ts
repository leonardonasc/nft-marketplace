import { http, HttpResponse, ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'
import { nftFixtures } from './fixtures'
import type { NftListResponse } from '../types/nft'
import type { CartItem } from '../lib/cart'
import type { Order } from '../lib/orders'

const ordersByIdempotencyKey = new Map<string, { fingerprint: string; order: Order }>()
const users = new Map([
    ['colecionador@kurio.local', { userId: 'user-001', username: 'colecionador', email: 'colecionador@kurio.local', password: 'kurio123' }],
    ['artista@kurio.local', { userId: 'user-002', username: 'artista', email: 'artista@kurio.local', password: 'kurio123' }],
])

const realtimeConnections = [
    ws.link('ws://localhost:5173/socket.io'),
    ws.link('ws://127.0.0.1:5173/socket.io'),
    ws.link('ws://localhost:4173/socket.io'),
    ws.link('ws://127.0.0.1:4173/socket.io'),
]

const realtimeHandlers = realtimeConnections.map((endpoint) => endpoint.addEventListener('connection', (connection) => {
    const io = toSocketIo(connection)
    io.server.on('subscribe', () => {
        io.server.emit('nft.updated', {
            resourceId: 'nft-001',
            version: 1,
            priceEth: '0.42',
            availableQuantity: 5,
        })
    })
}))

export const handlers = [
    ...realtimeHandlers,
    http.post('/api/auth/register', async ({ request }) => {
        const body = await request.json() as { username?: string; email?: string; password?: string }
        if (!body.username || !body.email || !body.password || body.password.length < 6) {
            return HttpResponse.json({ message: 'Dados de cadastro inválidos' }, { status: 422 })
        }
        if (users.has(body.email)) return HttpResponse.json({ message: 'Este e-mail já está cadastrado' }, { status: 409 })
        const user = { userId: createId(), username: body.username, email: body.email, password: body.password }
        users.set(user.email, user)
        return HttpResponse.json(publicSession(user), { status: 201 })
    }),
    http.post('/api/auth/login', async ({ request }) => {
        const body = await request.json() as { email?: string; password?: string }
        const user = body.email ? users.get(body.email) : undefined
        if (!user || user.password !== body.password) return HttpResponse.json({ message: 'E-mail ou senha inválidos' }, { status: 401 })
        return HttpResponse.json(publicSession(user))
    }),
    http.post('/api/auth/social', async ({ request }) => {
        const body = await request.json() as { provider?: string }
        if (!body.provider) return HttpResponse.json({ message: 'Provedor inválido' }, { status: 422 })
        const email = `${body.provider.toLowerCase()}@kurio.local`
        const user = users.get(email) ?? { userId: createId(), username: body.provider, email, password: createId() }
        users.set(email, user)
        return HttpResponse.json(publicSession(user))
    }),
    http.put('/api/account/profile', async ({ request }) => {
        const body = await request.json() as { currentEmail?: string; username?: string; email?: string }
        const user = body.currentEmail ? users.get(body.currentEmail) : undefined
        if (!user || !body.username || !body.email) return HttpResponse.json({ message: 'Perfil inválido' }, { status: 422 })
        if (body.email !== body.currentEmail && users.has(body.email)) return HttpResponse.json({ message: 'Este e-mail já está cadastrado' }, { status: 409 })
        users.delete(user.email)
        user.username = body.username
        user.email = body.email
        users.set(user.email, user)
        return HttpResponse.json(publicSession(user))
    }),
    http.post('/api/account/password', async ({ request }) => {
        const body = await request.json() as { email?: string; currentPassword?: string; newPassword?: string }
        const user = body.email ? users.get(body.email) : undefined
        if (!user || user.password !== body.currentPassword) return HttpResponse.json({ message: 'A senha atual não confere' }, { status: 401 })
        if (!body.newPassword || body.newPassword.length < 6) return HttpResponse.json({ message: 'Nova senha inválida' }, { status: 422 })
        user.password = body.newPassword
        return HttpResponse.json({ ok: true })
    }),
    http.get('/api/nfts', ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '12')

        const start = (page - 1) * pageSize
        const items = nftFixtures.slice(start, start + pageSize)

        const response: NftListResponse = {
            items,
            page,
            pageSize,
            total: nftFixtures.length,
        }

        return HttpResponse.json(response)
    }),
    http.post('/api/quotes', async ({ request }) => {
        const body = await request.json() as { items?: Array<{ nftId: string; quantity: number }>; coupon?: string }
        const items = body.items?.flatMap(({ nftId, quantity }) => {
            const nft = nftFixtures.find((fixture) => fixture.id === nftId)
            return nft && Number.isInteger(quantity) && quantity > 0 && quantity <= nft.availableQuantity
                ? [{ nft, quantity }]
                : []
        }) ?? []

        if (!items.length || items.length !== body.items?.length) {
            return HttpResponse.json({ message: 'Carrinho inválido ou estoque insuficiente' }, { status: 409 })
        }
        if (body.coupon?.toUpperCase() === 'EXPIRED') {
            return HttpResponse.json({ message: 'Este cupom expirou' }, { status: 410 })
        }
        if (body.coupon && body.coupon.toUpperCase() !== 'KURIO10') {
            return HttpResponse.json({ message: 'Cupom inválido' }, { status: 422 })
        }

        const subtotal = items.reduce((sum, item) => sum + Number(item.nft.priceEth) * item.quantity, 0)
        const discount = body.coupon?.toUpperCase() === 'KURIO10' ? subtotal * 0.1 : 0
        const networkFee = 0.016
        return HttpResponse.json({
            subtotal: subtotal.toFixed(6),
            discount: discount.toFixed(6),
            networkFee: networkFee.toFixed(6),
            total: (subtotal - discount + networkFee).toFixed(6),
            coupon: body.coupon?.toUpperCase() === 'KURIO10' ? 'KURIO10' : null,
        })
    }),
    http.post('/api/orders', async ({ request }) => {
        const idempotencyKey = request.headers.get('Idempotency-Key')
        if (!idempotencyKey) {
            return HttpResponse.json({ message: 'Idempotency-Key is required' }, { status: 400 })
        }

        const body = await request.json() as { wallet?: string; items?: Array<{ nftId: string; quantity: number }> }
        const fingerprint = JSON.stringify(body)
        const existingRequest = ordersByIdempotencyKey.get(idempotencyKey)
        if (existingRequest) {
            if (existingRequest.fingerprint !== fingerprint) return HttpResponse.json({ message: 'Idempotency-Key conflict' }, { status: 409 })
            return HttpResponse.json(existingRequest.order)
        }

        if (body.wallet === 'coinbase wallet') {
            return HttpResponse.json({ message: 'Pagamento recusado pela carteira' }, { status: 402 })
        }

        const items = body.items?.flatMap(({ nftId, quantity }) => {
            const nft = nftFixtures.find((fixture) => fixture.id === nftId)
            return nft && Number.isInteger(quantity) && quantity > 0 && quantity <= nft.availableQuantity
                ? [{ nft, quantity }]
                : []
        }) ?? []

        if (!body.wallet || !items.length || items.length !== body.items?.length) {
            return HttpResponse.json({ message: 'Order data is invalid' }, { status: 422 })
        }

        const subtotal = items.reduce((sum, item) => sum + Number(item.nft.priceEth) * item.quantity, 0)
        const fee = 0.016
        const order: Order = {
            id: createId(),
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            wallet: body.wallet,
            items: items as CartItem[],
            subtotal,
            fee,
            total: subtotal + fee,
            transactionId: `0x${createId().replaceAll('-', '').slice(0, 12).toUpperCase()}`,
        }

        ordersByIdempotencyKey.set(idempotencyKey, { fingerprint, order })
        return HttpResponse.json(order, { status: 201 })
    }),
]

function createId() {
    return typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function publicSession(user: { userId: string; username: string; email: string }) {
    return { userId: user.userId, username: user.username, email: user.email }
}
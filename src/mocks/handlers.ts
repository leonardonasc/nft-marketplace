import { http, HttpResponse } from 'msw'
import { nftFixtures } from './fixtures'
import type { NftListResponse } from '../types/nft'

export const handlers = [
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
]
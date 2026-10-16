import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/api-client'
import { nftFixtures } from '../../mocks/fixtures'
import type { NftListResponse } from '../../types/nft'

type CatalogParams = {
    page?: number
    pageSize?: number
}

async function fetchNfts({
    page = 1,
    pageSize = 12,
}: CatalogParams): Promise<NftListResponse> {
    const getLocalNfts = (): NftListResponse => {
        const start = (page - 1) * pageSize

        return {
            items: nftFixtures.slice(start, start + pageSize),
            page,
            pageSize,
            total: nftFixtures.length,
        }
    }

    // MSW is enabled only during development. Vercel does not provide the
    // mocked /api/nfts endpoint, so production uses the local catalog data
    // until a real API is configured.
    if (import.meta.env.PROD) return getLocalNfts()

    try {
        const response = await apiClient.get<NftListResponse>('/nfts', {
            params: { page, pageSize },
        })

        return response.data
    } catch {
        // Keep the catalog usable if the local mock worker fails to start.
        return getLocalNfts()
    }
}

export function useNfts(params: CatalogParams = {}) {
    return useQuery({
        queryKey: ['nfts', params],
        queryFn: () => fetchNfts(params),
    })
}
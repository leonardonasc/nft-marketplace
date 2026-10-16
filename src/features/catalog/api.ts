import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/api-client'
import type { NftListResponse } from '../../types/nft'

type CatalogParams = {
    page?: number
    pageSize?: number
}

async function fetchNfts({
    page = 1,
    pageSize = 12,
}: CatalogParams): Promise<NftListResponse> {
    const response = await apiClient.get<NftListResponse>('/nfts', {
        params: { page, pageSize },
    })

    return response.data
}

export function useNfts(params: CatalogParams = {}) {
    return useQuery({
        queryKey: ['nfts', params],
        queryFn: () => fetchNfts(params),
    })
}
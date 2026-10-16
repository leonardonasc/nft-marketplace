export type Nft = {
    id: string
    name: string
    collection: string
    imageUrl: string
    priceEth: string
    availableQuantity: number
    creator: string
    isRare?: boolean
}

export type NftListResponse = {
    items: Nft[]
    page: number
    pageSize: number
    total: number
}
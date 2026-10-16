import { nftFixtures } from '@/mocks/fixtures'
import NftCard from './nft-card'
import { useEffect, useState } from 'react'

export default function RelatedNfts({ title = 'Mais desta coleção' }: { title?: string }) {
    const [page, setPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(2)

    useEffect(() => {
        const updateItemsPerPage = () => setItemsPerPage(window.matchMedia('(min-width: 768px)').matches ? 5 : 2)

        updateItemsPerPage()
        window.addEventListener('resize', updateItemsPerPage)
        return () => window.removeEventListener('resize', updateItemsPerPage)
    }, [])

    const pageCount = Math.max(1, Math.ceil(nftFixtures.length / itemsPerPage))
    const visibleNfts = nftFixtures.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

    return (
        <section className="mx-auto mt-14 max-w-7xl">
            <h2 className="mb-4 border-b border-border pb-2 text-xs font-bold text-amber">{title}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {visibleNfts.map((nft) => <NftCard key={nft.id} {...nft} />)}
            </div>
            {pageCount > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                    {Array.from({ length: pageCount }, (_, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Ver página ${index + 1}`}
                            onClick={() => setPage(index)}
                            className={`size-2 rounded-full transition-colors ${page === index ? 'bg-primary' : 'bg-primary/40'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

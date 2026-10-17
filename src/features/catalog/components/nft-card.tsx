import FavoriteButton from "./favorite-button";

interface NftCardProps {
  id: string;
  imageUrl: string;
  name: string;
  priceEth: string;
  isRare?: boolean;
}

export default function NftCard({ id, imageUrl, name, priceEth, isRare = false }: NftCardProps) {
  return (
    <article
      className="flex min-w-0 cursor-pointer flex-col gap-2 self-start md:mt-0 max-md:even:mt-8"
      onClick={() => {
        window.location.href = `/nft/${id}`
      }}
    >
      <div className="nft-card-gradient relative rounded-2xl px-1 pt-2 pb-3">
        {isRare && <span className="absolute top-2 left-1 z-10 bg-primary px-3 py-2 text-xs font-bold text-ink">RARO</span>}
        <img
          src={imageUrl}
          alt={name}
          className="aspect-square w-full rounded-xl object-cover"
        />

        <div
          className="absolute top-4 right-2"
          onClick={(event) => event.stopPropagation()}
        >
          <FavoriteButton nftId={id} hideWhenInactive />
        </div>
      </div>

      <div className="flex flex-col px-2">
        <h2 className="truncate text-[11px] text-foreground">{name}</h2>
        <p className="text-[13px] font-bold uppercase text-amber">
          {priceEth} ETH
        </p>
      </div>
    </article>
  )
}
import { Gift as GiftIcon, Sparkles } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { getPublicImageUrl } from "@/lib/supabase/storage"
import { cn } from "@/lib/utils"
import type { Gift } from "@/types/gift"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

type GiftCardProps = {
  gift: Gift
  categoryName: string
  categorySlug?: string | null
  special?: boolean
}

export function GiftCard({
  categoryName,
  categorySlug,
  gift,
  special = false,
}: GiftCardProps) {
  const imageUrl = gift.image_path
    ? getPublicImageUrl(gift.image_path)
    : null
  const isAvailable = gift.status === "available"
  const statusLabel = isAvailable ? "Disponível" : "Reservado"
  const detailsHref = categorySlug
    ? `/lista-presentes/${gift.id}?categoria=${encodeURIComponent(categorySlug)}`
    : `/lista-presentes/${gift.id}`

  return (
    <Card
      role="article"
      aria-label={`${gift.name}, ${special ? "presente especial, " : ""}${statusLabel}`}
      className={cn(
        "relative flex min-h-[336px] flex-col overflow-hidden rounded-[4px] border-[#B9DCEB] shadow-[0_2px_8px_rgba(38,55,72,0.06)] transition-all duration-200 lg:min-h-[366px]",
        isAvailable
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(38,55,72,0.12)]"
          : "cursor-default bg-[#F8FAFC]",
      )}
    >
      {isAvailable ? (
        <Link
          href={detailsHref}
          aria-label={`Ver detalhes de ${gift.name}, ${statusLabel.toLowerCase()}`}
          className="absolute inset-0 z-20 rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1682C0]"
        />
      ) : null}

      <div className="relative aspect-4/3 shrink-0 overflow-hidden bg-[#E5F3FA]">
        {imageUrl ? (
          // A URL externa já é pública e não utiliza o otimizador do Next.js.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={gift.name}
            loading="lazy"
            className={cn(
  "size-full bg-white object-contain transition-[filter,opacity]",
  !isAvailable && "grayscale-[35%] opacity-80",
)}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <GiftIcon
              aria-hidden="true"
              className="size-10 text-[#2D89BD]"
              strokeWidth={1.7}
            />
          </div>
        )}

        {categoryName ? (
          <Badge
            variant="outline"
            className="absolute left-3 top-3 rounded-[3px] border-[#D8E8F0] bg-white px-2.5 py-1 text-[12px] font-normal text-[#5B6D80]"
          >
            {categoryName}
          </Badge>
        ) : null}

        {special ? (
          <Badge
            aria-label="Presente especial"
            className="absolute right-3 top-3 gap-1 rounded-[4px] bg-[#88CDF6] px-2.5 py-1 text-[12px] font-semibold text-[#263748]"
          >
            <Sparkles aria-hidden="true" className="size-3" />
            Especial
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-1 font-serif text-[17px] font-semibold leading-6 text-[#263748] lg:text-lg">
          {gift.name}
        </h2>

        <p className="mt-1.5 line-clamp-4 min-h-[76px] text-[13px] leading-[19px] text-[#627489] lg:line-clamp-3 lg:min-h-[57px]">
          {gift.description ?? ""}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-[#C9DFEA] pt-4">
          {gift.estimated_price !== null ? (
            <span className="whitespace-nowrap font-serif text-[16px] font-semibold text-[#263748] lg:text-[17px]">
              {currencyFormatter.format(gift.estimated_price)}
            </span>
          ) : (
            <span className="whitespace-nowrap font-serif text-[16px] font-semibold text-[#1682C0] lg:text-[17px]">
              Valor livre
            </span>
          )}

          <Badge
            aria-label={`Status: ${statusLabel}`}
            variant={isAvailable ? "success" : "danger"}
            className={cn(
              "shrink-0 gap-1 rounded-none bg-transparent p-0 text-[12px] font-medium",
              isAvailable ? "text-[#18B84E]" : "text-[#DC2626]",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                isAvailable ? "bg-[#18B84E]" : "bg-[#DC2626]",
              )}
            />
            {statusLabel}
          </Badge>
        </div>
      </div>
    </Card>
  )
}

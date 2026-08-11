import { GiftCard } from "@/components/features/gifts/GiftCard"
import { GiftCardSkeleton } from "@/components/features/gifts/GiftCardSkeleton"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { Gift } from "@/types/gift"

type GiftGridProps = {
  ariaLabel?: string
  categories: Category[]
  className?: string
  gifts: Gift[]
  categorySlug?: string | null
  loading?: boolean
  special?: boolean
}

const SKELETON_ITEMS = 8

export function GiftGrid({
  ariaLabel = "Lista de presentes",
  categories,
  className,
  gifts,
  categorySlug,
  loading = false,
  special = false,
}: GiftGridProps) {
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  )

  return (
    <div
      aria-busy={loading}
      aria-label={ariaLabel}
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5",
        className,
      )}
    >
      {loading
        ? Array.from({ length: SKELETON_ITEMS }, (_, index) => (
            <GiftCardSkeleton key={index} />
          ))
        : gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              categoryName={
                gift.category_id
                  ? (categoryNames.get(gift.category_id) ?? "")
                  : ""
              }
              categorySlug={categorySlug}
              special={special}
            />
          ))}
    </div>
  )
}

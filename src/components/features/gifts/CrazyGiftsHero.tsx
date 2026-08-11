import { Flower2 } from "lucide-react"

import { FloralCornerOrnament } from "@/components/ui/FloralCornerOrnament"
import { Skeleton } from "@/components/ui/Skeleton"

type CrazyGiftsHeroProps = {
  giftCount: number
  loading?: boolean
}

export function CrazyGiftsHero({
  giftCount,
  loading = false,
}: CrazyGiftsHeroProps) {
  const countLabel = `${giftCount} ${
    giftCount === 1 ? "presente exclusivo" : "presentes exclusivos"
  }`

  return (
    <section
      aria-labelledby="crazy-gifts-title"
      className="relative isolate flex min-h-[244px] w-full items-center justify-center overflow-hidden border border-[#B9DCEB] bg-[#EEF8FC] px-6 py-10 text-center sm:min-h-[256px] sm:px-12"
    >
      <FloralCornerOrnament className="-left-7 -top-6 opacity-80 sm:left-0 sm:top-0" />
      <FloralCornerOrnament className="-bottom-6 -right-7 rotate-180 opacity-80 sm:bottom-0 sm:right-0" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1682C0] sm:text-xs">
          <Flower2 aria-hidden="true" className="size-4 text-[#A8D3E6]" />
          Categoria especial
          <Flower2 aria-hidden="true" className="size-4 text-[#A8D3E6]" />
        </p>

        <h1
          id="crazy-gifts-title"
          className="mt-5 font-serif text-[34px] font-semibold leading-none text-[#263748] sm:text-[42px]"
        >
          Presentes Malucos
        </h1>

        <p className="mt-3 font-serif text-lg italic leading-6 text-[#627489] sm:text-xl">
          Para quem quer nos surpreender de verdade.
        </p>

        {loading ? (
          <Skeleton className="mt-5 h-8 w-44 bg-[#D9E8F0]" />
        ) : (
          <p className="mt-5 rounded-[4px] border border-[#B9DCEB] bg-[#E5F3FA] px-4 py-1.5 text-[13px] font-medium text-[#1682C0]">
            {countLabel}
          </p>
        )}
      </div>
    </section>
  )
}

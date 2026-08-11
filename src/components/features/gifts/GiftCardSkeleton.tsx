import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

export function GiftCardSkeleton() {
  return (
    <Card className="flex min-h-[336px] flex-col overflow-hidden rounded-[4px] border-[#D6E6EE] lg:min-h-[366px]">
      <Skeleton className="aspect-4/3 shrink-0 rounded-none bg-[#DFEDF4]" />

      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-5 w-3/4 bg-[#DFEDF4]" />
        <Skeleton className="mt-3 h-3 w-full bg-[#E7F0F4]" />
        <Skeleton className="mt-2 h-3 w-5/6 bg-[#E7F0F4]" />
        <Skeleton className="mt-2 h-3 w-2/3 bg-[#E7F0F4]" />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#D6E6EE] pt-4">
          <Skeleton className="h-4 w-16 bg-[#DFEDF4]" />
          <Skeleton className="h-4 w-20 bg-[#DFEDF4]" />
        </div>
      </div>
    </Card>
  )
}

import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

export function GiftDetailsSkeleton() {
  return (
    <Container className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <Skeleton className="h-5 w-52 bg-[#D9E8F0]" />

      <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-4/3 w-full rounded-none bg-[#D9E8F0]" />

        <div className="space-y-6">
          <Card className="rounded-none border-[#C6DDEA] p-6 shadow-none lg:p-8">
            <div className="flex gap-3">
              <Skeleton className="h-6 w-32 bg-[#D9E8F0]" />
              <Skeleton className="h-6 w-24 bg-[#D9E8F0]" />
            </div>
            <Skeleton className="mt-6 h-9 w-2/3 bg-[#D9E8F0]" />
            <Skeleton className="mt-3 h-7 w-36 bg-[#D9E8F0]" />
            <Skeleton className="mt-8 h-px w-full bg-[#D9E8F0]" />
            <Skeleton className="mt-8 h-5 w-full bg-[#E4EEF3]" />
            <Skeleton className="mt-2 h-5 w-4/5 bg-[#E4EEF3]" />
          </Card>

          <Card className="rounded-none border-[#C6DDEA] p-6 shadow-none lg:p-8">
            <Skeleton className="h-7 w-48 bg-[#D9E8F0]" />
            <Skeleton className="mt-4 h-4 w-full bg-[#E4EEF3]" />
            <Skeleton className="mt-8 h-12 w-full bg-[#E4EEF3]" />
            <Skeleton className="mt-5 h-24 w-full bg-[#E4EEF3]" />
          </Card>
        </div>
      </div>
    </Container>
  )
}

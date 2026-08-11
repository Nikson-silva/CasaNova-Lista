import { GiftDetails } from "@/components/features/gifts/GiftDetails"
import { Header } from "@/components/layout/Header"

type GiftDetailsPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ categoria?: string | string[] }>
}

export default async function GiftDetailsPage({
  params,
  searchParams,
}: GiftDetailsPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const categorySlug =
    typeof query.categoria === "string" ? query.categoria : undefined

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-68px)] bg-[#F5FAFD] lg:min-h-[calc(100vh-64px)]">
        <GiftDetails giftId={id} categorySlug={categorySlug} />
      </main>
    </>
  )
}

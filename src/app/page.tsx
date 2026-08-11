import { InvitationHero } from "@/components/features/invitation/InvitationHero"
import { Header } from "@/components/layout/Header"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-68px)] bg-[#F8F8FA] lg:min-h-[calc(100vh-64px)]">
        <InvitationHero />
      </main>
    </>
  )
}

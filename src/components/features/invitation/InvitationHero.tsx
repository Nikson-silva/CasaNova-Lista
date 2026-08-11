import { InvitationCard } from "@/components/features/invitation/InvitationCard"
import { cn } from "@/lib/utils"

type InvitationHeroProps = {
  className?: string
}

export function InvitationHero({ className }: InvitationHeroProps) {
  return (
    <section
      aria-label="Convite"
      className={cn("flex w-full justify-center px-[15px] py-8 lg:px-8", className)}
    >
      <InvitationCard />
    </section>
  )
}

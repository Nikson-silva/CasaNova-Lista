import { CalendarDays, Clock3, MapPin } from "lucide-react"

type InfoItemProps = {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

function InfoItem({ children, icon, label }: InfoItemProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 lg:flex-row lg:gap-3">
      <div className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#1682C0]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[22px] font-medium leading-none text-[#263748]">
        {children}
      </div>
    </div>
  )
}

export function InvitationInfo() {
  return (
    <div className="flex flex-col gap-3.5 lg:gap-5">
      <InfoItem
        icon={<CalendarDays aria-hidden="true" className="size-4" />}
        label="Data"
      >
        Domingo, 11 de outubro de 2026
      </InfoItem>

      <InfoItem
        icon={<Clock3 aria-hidden="true" className="size-4" />}
        label="Horário"
      >
        13h00
      </InfoItem>

      <InfoItem
        icon={<MapPin aria-hidden="true" className="size-4" />}
        label="Local"
      >
        <a
          href="https://maps.app.goo.gl/q2WAU64sB59xTJ687"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Local do evento no Google Maps em uma nova aba"
          className="inline-flex items-center gap-1 rounded-sm border-b-2 border-dotted border-[#1682C0] pb-0.5 outline-none transition-colors hover:border-solid hover:text-[#1682C0] focus-visible:ring-2 focus-visible:ring-[#1682C0]/30 focus-visible:ring-offset-2"
        >
          <MapPin
            aria-hidden="true"
            className="size-4 fill-[#EF4E45] text-[#EF4E45]"
          />
          Local do evento
        </a>
      </InfoItem>
    </div>
  )
}

"use client"

import { Menu } from "lucide-react"
import { useCallback, useState, type ReactNode } from "react"

import { MobileDrawer } from "@/components/layout/MobileDrawer"
import { Button } from "@/components/ui/Button"

type MobileNavigationProps = {
  logo: ReactNode
}

export function MobileNavigation({ logo }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const closeDrawer = useCallback(() => setIsOpen(false), [])

  return (
    <div className="ml-auto lg:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Abrir menu"
        aria-controls="mobile-navigation-drawer"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="-mr-2 text-[#263748] hover:bg-transparent focus-visible:ring-[#1682C0]/30"
      >
        <Menu aria-hidden="true" className="size-6" />
      </Button>

      <MobileDrawer logo={logo} open={isOpen} onClose={closeDrawer} />
    </div>
  )
}

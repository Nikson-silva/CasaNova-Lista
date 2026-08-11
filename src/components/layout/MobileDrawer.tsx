"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

import {
  isNavigationItemActive,
  NAVIGATION_ITEMS,
} from "@/components/layout/DesktopNavigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

type MobileDrawerProps = {
  logo: ReactNode
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ logo, open, onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) {
      return
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== "Tab") {
        return
      }

      const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements?.length) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocusedElement?.focus()
    }
  }, [onClose, open])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Fechar menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[#000020]/20 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1682C0]",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        id="mobile-navigation-drawer"
        ref={drawerRef}
        role="dialog"
        aria-label="Menu de navegação"
        aria-modal={open}
        inert={!open}
        className={cn(
          "relative flex h-full w-[280px] max-w-[calc(100%-2rem)] flex-col bg-white text-[#263748] shadow-xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex min-h-[85px] items-center justify-between border-b border-[#D9E5EC] px-5">
          <div
            className="max-w-[180px] leading-6"
            onClickCapture={onClose}
          >
            {logo}
          </div>

          <Button
            ref={closeButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar menu"
            onClick={onClose}
            className="-mr-2 text-[#5B6D80] hover:bg-transparent hover:text-[#263748] focus-visible:ring-[#1682C0]/30"
          >
            <X aria-hidden="true" className="size-5" />
          </Button>
        </div>

        <nav aria-label="Navegação mobile" className="px-3.5 py-4">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href)

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
                className={cn(
                  "flex h-12 items-center rounded-xl text-[15px] font-medium text-[#5B6D80] outline-none transition-colors hover:bg-[#F8F8FA] hover:text-[#263748] focus-visible:ring-2 focus-visible:ring-[#1682C0]/30",
                  isActive
                    ? "gap-3 bg-[#E8F3F9] px-4 text-[#263748]"
                    : "pl-[34px] pr-4",
                )}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-[#1682C0]"
                  />
                )}
                {item.label}
              </Link>
            )
          })}
        </nav>

      </aside>
    </div>
  )
}

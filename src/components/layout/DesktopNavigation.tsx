"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export const NAVIGATION_ITEMS = [
  { label: "Convite", href: "/" },
  { label: "Lista de Presentes", href: "/lista-presentes" },
  { label: "Presentes Malucos", href: "/presentes-malucos" },
] as const

export function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/") {
    return pathname === "/"
  }

  return (
    href !== "#" &&
    (pathname === href || pathname.startsWith(`${href}/`))
  )
}

export function DesktopNavigation() {
  const pathname = usePathname()

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="hidden items-center gap-1 lg:flex"
      >
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = isNavigationItemActive(pathname, item.href)

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative rounded-xl px-4 py-2.5 text-sm font-medium text-[#5B6D80] outline-none transition-colors hover:text-[#000020] focus-visible:ring-2 focus-visible:ring-[#1682C0]/30",
                isActive &&
                  "bg-[#E8F3F9] text-[#263748] after:absolute after:-bottom-3 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-[#1682C0]",
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

    </>
  )
}

"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/Button"
import { adminAuthService } from "@/services/frontend/admin-auth.service"

export function AdminLogoutButton() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function logout() {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await adminAuthService.logout()
    } finally {
      router.replace("/casanova-2405-admin/login")
      router.refresh()
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      loading={isSubmitting}
      disabled={isSubmitting}
      onClick={logout}
    >
      <LogOut aria-hidden="true" />
      Sair
    </Button>
  )
}

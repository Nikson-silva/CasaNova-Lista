import { redirect } from "next/navigation"

import { AdminGiftsPanel } from "@/components/features/admin/AdminGiftsPanel"
import { hasAdminSession } from "@/lib/admin/session"

export default async function AdminPage() {
  if (!(await hasAdminSession())) {
    redirect("/casanova-2405-admin/login")
  }

  return <AdminGiftsPanel />
}

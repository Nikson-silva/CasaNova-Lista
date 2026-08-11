import { redirect } from "next/navigation"

import { AdminLoginForm } from "@/components/features/admin/AdminLoginForm"
import { hasAdminSession } from "@/lib/admin/session"

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/casanova-2405-admin")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5FAFD] px-4 py-10">
      <AdminLoginForm />
    </main>
  )
}

import { ok } from "@/lib/api/response"
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
} from "@/lib/admin/session"

export async function POST() {
  const response = ok(null)

  response.cookies.set({
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    name: ADMIN_SESSION_COOKIE,
    value: "",
    maxAge: 0,
  })

  return response
}

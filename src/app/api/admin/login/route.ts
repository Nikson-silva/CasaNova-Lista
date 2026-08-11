import { z } from "zod"

import { internalError, ok, unauthorized } from "@/lib/api/response"
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  isValidAdminPassword,
} from "@/lib/admin/session"

const LoginSchema = z.object({
  password: z.string().min(1).max(1024),
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const loginRequest = LoginSchema.safeParse(body)

    if (!loginRequest.success || !isValidAdminPassword(loginRequest.data.password)) {
      return unauthorized("Senha inválida.")
    }

    const response = ok(null)

    response.cookies.set({
      ...ADMIN_SESSION_COOKIE_OPTIONS,
      name: ADMIN_SESSION_COOKIE,
      value: createAdminSessionToken(),
      maxAge: ADMIN_SESSION_MAX_AGE,
    })

    return response
  } catch {
    return internalError("Não foi possível iniciar a sessão administrativa.")
  }
}

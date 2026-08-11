import { z } from "zod"

import {
  badRequest,
  conflict,
  internalError,
  ok,
  unauthorized,
} from "@/lib/api/response"
import { requireAdminSession } from "@/lib/admin/session"
import { AdminGiftSchema } from "@/schemas/admin-gift.schema"
import {
  AdminGiftConflictError,
  AdminGiftService,
  AdminGiftValidationError,
} from "@/services/admin-gift.service"

const adminGiftService = new AdminGiftService()

async function hasAuthorizedSession(): Promise<boolean> {
  try {
    await requireAdminSession()
    return true
  } catch {
    return false
  }
}

export async function GET() {
  if (!(await hasAuthorizedSession())) {
    return unauthorized("Não autorizado.")
  }

  try {
    return ok(await adminGiftService.findAll())
  } catch {
    return internalError("Não foi possível concluir a operação.")
  }
}

export async function POST(request: Request) {
  if (!(await hasAuthorizedSession())) {
    return unauthorized("Não autorizado.")
  }

  try {
    const body: unknown = await request.json()
    const giftRequest = AdminGiftSchema.parse(body)

    return ok(await adminGiftService.create(giftRequest))
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return badRequest("Dados inválidos.")
    }

    if (error instanceof AdminGiftValidationError) {
      return badRequest(error.message)
    }

    if (error instanceof AdminGiftConflictError || isUniqueConstraintError(error)) {
      return conflict(
        error instanceof AdminGiftConflictError
          ? error.message
          : "Já existe um presente com este display order.",
      )
    }

    return internalError("Não foi possível concluir a operação.")
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  )
}

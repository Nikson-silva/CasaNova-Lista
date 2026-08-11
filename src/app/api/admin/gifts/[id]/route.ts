import { z } from "zod"

import {
  badRequest,
  conflict,
  internalError,
  notFound,
  ok,
  unauthorized,
} from "@/lib/api/response"
import { requireAdminSession } from "@/lib/admin/session"
import { AdminGiftIdSchema, AdminGiftSchema } from "@/schemas/admin-gift.schema"
import {
  AdminGiftConflictError,
  AdminGiftNotFoundError,
  AdminGiftService,
  AdminGiftValidationError,
} from "@/services/admin-gift.service"

const adminGiftService = new AdminGiftService()

type RouteContext = {
  params: Promise<{ id: string }>
}

async function getAuthorizedGiftId(context: RouteContext): Promise<string | null> {
  try {
    await requireAdminSession()
  } catch {
    return null
  }

  const { id } = await context.params

  return AdminGiftIdSchema.safeParse(id).success ? id : ""
}

export async function GET(_request: Request, context: RouteContext) {
  const id = await getAuthorizedGiftId(context)

  if (id === null) {
    return unauthorized("Não autorizado.")
  }

  if (!id) {
    return badRequest("Dados inválidos.")
  }

  try {
    return ok(await adminGiftService.findById(id))
  } catch (error) {
    if (error instanceof AdminGiftNotFoundError) {
      return notFound("Presente não encontrado.")
    }

    return internalError("Não foi possível concluir a operação.")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const id = await getAuthorizedGiftId(context)

  if (id === null) {
    return unauthorized("Não autorizado.")
  }

  if (!id) {
    return badRequest("Dados inválidos.")
  }

  try {
    const body: unknown = await request.json()
    const giftRequest = AdminGiftSchema.parse(body)

    return ok(await adminGiftService.update(id, giftRequest))
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return badRequest("Dados inválidos.")
    }

    if (error instanceof AdminGiftNotFoundError) {
      return notFound("Presente não encontrado.")
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

export async function DELETE(_request: Request, context: RouteContext) {
  const id = await getAuthorizedGiftId(context)

  if (id === null) {
    return unauthorized("Não autorizado.")
  }

  if (!id) {
    return badRequest("Dados inválidos.")
  }

  try {
    await adminGiftService.remove(id)

    return ok(null)
  } catch (error) {
    if (error instanceof AdminGiftNotFoundError) {
      return notFound("Presente não encontrado.")
    }

    if (error instanceof AdminGiftConflictError || isForeignKeyError(error)) {
      return conflict(
        error instanceof AdminGiftConflictError
          ? error.message
          : "Não é possível excluir um presente que possui reservas.",
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

function isForeignKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23503"
  )
}

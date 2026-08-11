import {
  badRequest,
  conflict,
  internalError,
  notFound,
  ok,
  unauthorized,
} from "@/lib/api/response"
import { requireAdminSession } from "@/lib/admin/session"
import { AdminReservationIdSchema } from "@/schemas/admin-reservation.schema"
import {
  AdminReservationConflictError,
  AdminReservationNotFoundError,
  AdminReservationService,
} from "@/services/admin-reservation.service"

const adminReservationService = new AdminReservationService()

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession()
  } catch {
    return unauthorized("Não autorizado.")
  }

  const { id } = await context.params

  if (!AdminReservationIdSchema.safeParse(id).success) {
    return badRequest("Dados inválidos.")
  }

  try {
    return ok(await adminReservationService.cancel(id))
  } catch (error) {
    if (error instanceof AdminReservationNotFoundError) {
      return notFound(error.message)
    }

    if (error instanceof AdminReservationConflictError) {
      return conflict(error.message)
    }

    return internalError("Não foi possível cancelar a reserva.")
  }
}

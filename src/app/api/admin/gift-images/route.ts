import {
  badRequest,
  conflict,
  internalError,
  ok,
  unauthorized,
} from "@/lib/api/response"
import { requireAdminSession } from "@/lib/admin/session"
import {
  AdminGiftImageConflictError,
  AdminGiftImageService,
  AdminGiftImageValidationError,
} from "@/services/admin-gift-image.service"

const adminGiftImageService = new AdminGiftImageService()

export async function POST(request: Request) {
  try {
    await requireAdminSession()
  } catch {
    return unauthorized("Não autorizado.")
  }

  try {
    const formData = await request.formData()
    const image = formData.get("image")

    if (!(image instanceof File)) {
      return badRequest("Imagem inválida.")
    }

    return ok({ image_path: await adminGiftImageService.upload(image) })
  } catch (error) {
    if (error instanceof AdminGiftImageValidationError) {
      return badRequest(error.message)
    }

    return internalError("Não foi possível enviar a imagem.")
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession()
  } catch {
    return unauthorized("Não autorizado.")
  }

  const imagePath = new URL(request.url).searchParams.get("path")

  if (!imagePath) {
    return badRequest("Imagem inválida.")
  }

  try {
    await adminGiftImageService.remove(imagePath)

    return ok(null)
  } catch (error) {
    if (error instanceof AdminGiftImageValidationError) {
      return badRequest(error.message)
    }

    if (error instanceof AdminGiftImageConflictError) {
      return conflict(error.message)
    }

    return internalError("Não foi possível remover a imagem.")
  }
}

import "server-only"

import { randomUUID } from "node:crypto"

import { AdminGiftImageRepository } from "@/repositories/admin-gift-image.repository"

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const PRODUCTS_PREFIX = "products/"

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export class AdminGiftImageValidationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class AdminGiftImageConflictError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class AdminGiftImageService {
  constructor(
    private readonly repository: typeof AdminGiftImageRepository =
      AdminGiftImageRepository,
  ) {}

  async upload(file: File): Promise<string> {
    const extension = IMAGE_EXTENSIONS[file.type]

    if (!extension) {
      throw new AdminGiftImageValidationError("Imagem inválida.")
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new AdminGiftImageValidationError("Arquivo muito grande.")
    }

    const imagePath = `${PRODUCTS_PREFIX}${randomUUID()}.${extension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await this.repository.upload(imagePath, buffer, file.type)

    return imagePath
  }

  async remove(path: string): Promise<void> {
    if (!isManagedGiftImagePath(path)) {
      throw new AdminGiftImageValidationError("Imagem inválida.")
    }

    if ((await this.repository.countGiftReferences(path)) > 0) {
      throw new AdminGiftImageConflictError(
        "A imagem ainda está associada a outro presente.",
      )
    }

    await this.repository.remove(path)
  }
}

export function isManagedGiftImagePath(path: string): boolean {
  const filename = path.slice(PRODUCTS_PREFIX.length)

  return (
    path.startsWith(PRODUCTS_PREFIX) &&
    filename.length > 0 &&
    !filename.includes("/") &&
    !filename.includes("\\") &&
    filename !== "." &&
    filename !== ".." &&
    !filename.includes("\0")
  )
}

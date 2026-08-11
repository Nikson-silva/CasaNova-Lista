import { AdminGiftRepository } from "@/repositories/admin-gift.repository"
import type { AdminGiftRequest } from "@/schemas/admin-gift.schema"
import type { Gift, GiftInsert, GiftUpdate } from "@/types/gift"

export class AdminGiftNotFoundError extends Error {
  constructor() {
    super("Presente não encontrado.")
  }
}

export class AdminGiftValidationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class AdminGiftConflictError extends Error {
  constructor(message: string) {
    super(message)
  }
}

function toGiftData(data: AdminGiftRequest): GiftInsert {
  return data
}

export class AdminGiftService {
  constructor(
    private readonly adminGiftRepository: typeof AdminGiftRepository =
      AdminGiftRepository,
  ) {}

  async findAll(): Promise<Gift[]> {
    return this.adminGiftRepository.findAll()
  }

  async findById(id: string): Promise<Gift> {
    try {
      return await this.adminGiftRepository.findById(id)
    } catch (error) {
      if (isMissingRecordError(error)) {
        throw new AdminGiftNotFoundError()
      }

      throw error
    }
  }

  async create(data: AdminGiftRequest): Promise<Gift> {
    await this.validateReferenceData(data)
    await this.ensureDisplayOrderIsAvailable(data.display_order)

    return this.adminGiftRepository.create(toGiftData(data))
  }

  async update(id: string, data: AdminGiftRequest): Promise<Gift> {
    const currentGift = await this.findById(id)

    if (
      currentGift.status === "reserved" &&
      data.status === "available" &&
      (await this.adminGiftRepository.hasActiveReservation(id))
    ) {
      throw new AdminGiftConflictError(
        "Este presente possui uma reserva ativa. Para liberá-lo, use a opção de liberar reserva.",
      )
    }
    await this.validateReferenceData(data)
    await this.ensureDisplayOrderIsAvailable(data.display_order, id)

    const updateData: GiftUpdate = data

    return this.adminGiftRepository.update(id, updateData)
  }

  async remove(id: string): Promise<void> {
    const gift = await this.findById(id)

    if (gift.status === "reserved") {
      throw new AdminGiftConflictError(
        "Não é possível excluir um presente reservado.",
      )
    }

    await this.adminGiftRepository.remove(id)
  }

  private async validateReferenceData(data: AdminGiftRequest): Promise<void> {
    if (
      data.category_id &&
      !(await this.adminGiftRepository.categoryExists(data.category_id))
    ) {
      throw new AdminGiftValidationError("Categoria não encontrada.")
    }
  }

  private async ensureDisplayOrderIsAvailable(
    displayOrder: number,
    excludedGiftId?: string,
  ): Promise<void> {
    const giftWithSameOrder = await this.adminGiftRepository.findByDisplayOrder(
      displayOrder,
      excludedGiftId,
    )

    if (giftWithSameOrder) {
      throw new AdminGiftConflictError(
        "Já existe um presente com este display order.",
      )
    }
  }
}

function isMissingRecordError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "PGRST116"
  )
}

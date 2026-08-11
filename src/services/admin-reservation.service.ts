import { AdminReservationRepository } from "@/repositories/admin-reservation.repository"
import type { AdminReservation } from "@/types/admin-reservation"
import type { Reservation } from "@/types/reservation"

export class AdminReservationNotFoundError extends Error {
  constructor() {
    super("Reserva não encontrada.")
  }
}

export class AdminReservationConflictError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class AdminReservationService {
  constructor(
    private readonly repository: typeof AdminReservationRepository =
      AdminReservationRepository,
  ) {}

  async findAll(): Promise<AdminReservation[]> {
    return this.repository.findAll()
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.findById(id)

    if (reservation.cancelled_at !== null) {
      throw new AdminReservationConflictError("Esta reserva já foi cancelada.")
    }

    try {
      return await this.repository.cancelByGiftId(reservation.gift_id)
    } catch (error) {
      if (isCancellationConflict(error)) {
        throw new AdminReservationConflictError(
          "A reserva não está mais ativa. Atualize a lista e tente novamente.",
        )
      }

      throw error
    }
  }

  private async findById(id: string): Promise<Reservation> {
    try {
      return await this.repository.findById(id)
    } catch (error) {
      if (isMissingRecordError(error)) {
        throw new AdminReservationNotFoundError()
      }

      throw error
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

function isCancellationConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "P0003" || error.code === "P0004")
  )
}

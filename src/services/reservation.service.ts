import { ReservationRepository } from "@/repositories/reservation.repository"
import type { Reservation, ReservationInsert } from "@/types/reservation"

export class ReservationService {
  constructor(
    private readonly reservationRepository: typeof ReservationRepository =
      ReservationRepository,
  ) {}

  async reserveGift(data: ReservationInsert): Promise<Reservation> {
    const reservation = await this.reservationRepository.reserveGift(data)

    return reservation
  }
}

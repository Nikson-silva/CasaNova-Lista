import { GiftService } from "@/services/gift.service";
import { ReservationRepository } from "@/repositories/reservation.repository";
import type { Reservation, ReservationInsert } from "@/types/reservation";

export class ReservationService {
    constructor(
        private readonly reservationRepository: typeof ReservationRepository = ReservationRepository,
        private readonly giftService: GiftService = new GiftService(),
    ) {}

    async reserveGift(data: ReservationInsert): Promise<Reservation | null> {
        const gift = await this.giftService.findById(data.gift_id);

        const isPix = gift.kind === "normal" && gift.category_id === null;

        if (isPix) {
            return null;
        }

        const reservation = await this.reservationRepository.reserveGift(data);

        return reservation;
    }
}

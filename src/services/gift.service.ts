import { GiftRepository } from "@/repositories/gift.repository"
import type { Gift } from "@/types/gift"

export class GiftService {
  constructor(
    private readonly giftRepository: typeof GiftRepository = GiftRepository,
  ) {}

  async findAll(): Promise<Gift[]> {
    const gifts = await this.giftRepository.findAll()

    return gifts
  }

  async findById(id: string): Promise<Gift> {
    const gift = await this.giftRepository.findById(id)

    return gift
  }
}

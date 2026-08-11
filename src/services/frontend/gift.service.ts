import { httpClient } from "@/lib/api/client"
import type { Gift } from "@/types/gift"

export const giftService = {
  getGifts(): Promise<Gift[]> {
    return httpClient.get<Gift[]>("/api/gifts")
  },

  getGift(id: string): Promise<Gift> {
    return httpClient.get<Gift>(`/api/gifts/${id}`)
  },
}

import { httpClient } from "@/lib/api/client"
import type { AdminGiftRequest } from "@/schemas/admin-gift.schema"
import type { Gift } from "@/types/gift"

export const adminGiftService = {
  getGifts(): Promise<Gift[]> {
    return httpClient.get<Gift[]>("/api/admin/gifts")
  },

  createGift(data: AdminGiftRequest): Promise<Gift> {
    return httpClient.post<Gift>("/api/admin/gifts", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  },

  updateGift(id: string, data: AdminGiftRequest): Promise<Gift> {
    return httpClient.patch<Gift>(`/api/admin/gifts/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  },

  deleteGift(id: string): Promise<null> {
    return httpClient.delete<null>(`/api/admin/gifts/${id}`)
  },
}

"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminGiftService } from "@/services/frontend/admin-gift.service"
import type { AdminGiftRequest } from "@/schemas/admin-gift.schema"

const ADMIN_GIFTS_QUERY_KEY = ["admin", "gifts"] as const

function useAdminGiftInvalidation() {
  const queryClient = useQueryClient()

  return async (giftId?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ADMIN_GIFTS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ["gifts"], exact: true }),
      ...(giftId
        ? [
            queryClient.invalidateQueries({
              queryKey: ["admin", "gifts", giftId],
              exact: true,
            }),
            queryClient.invalidateQueries({
              queryKey: ["gifts", giftId],
              exact: true,
            }),
          ]
        : []),
    ])
  }
}

export function useAdminGifts() {
  return useQuery({
    queryKey: ADMIN_GIFTS_QUERY_KEY,
    queryFn: adminGiftService.getGifts,
  })
}

export function useCreateAdminGift() {
  const invalidate = useAdminGiftInvalidation()

  return useMutation({
    mutationFn: (data: AdminGiftRequest) => adminGiftService.createGift(data),
    onSuccess: async (gift) => {
      await invalidate(gift.id)
    },
  })
}

export function useUpdateAdminGift() {
  const invalidate = useAdminGiftInvalidation()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminGiftRequest }) =>
      adminGiftService.updateGift(id, data),
    onSuccess: async (gift) => {
      await invalidate(gift.id)
    },
  })
}

export function useDeleteAdminGift() {
  const invalidate = useAdminGiftInvalidation()

  return useMutation({
    mutationFn: (id: string) => adminGiftService.deleteGift(id),
    onSuccess: async (_result, id) => {
      await invalidate(id)
    },
  })
}

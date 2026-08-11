"use client"

import { useQuery } from "@tanstack/react-query"

import { giftService } from "@/services/frontend/gift.service"

export function useGift(id: string) {
  return useQuery({
    queryKey: ["gifts", id],
    queryFn: () => giftService.getGift(id),
    enabled: Boolean(id),
    retry: false,
  })
}

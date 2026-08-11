"use client"

import { useQuery } from "@tanstack/react-query"

import { giftService } from "@/services/frontend/gift.service"

export function useGifts() {
  return useQuery({
    queryKey: ["gifts"],
    queryFn: () => giftService.getGifts(),
  })
}

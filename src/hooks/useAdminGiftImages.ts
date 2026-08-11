"use client"

import { useMutation } from "@tanstack/react-query"

import { adminGiftImageService } from "@/services/frontend/admin-gift-image.service"

export function useUploadAdminGiftImage() {
  return useMutation({
    mutationFn: adminGiftImageService.uploadImage,
  })
}

export function useDeleteAdminGiftImage() {
  return useMutation({
    mutationFn: adminGiftImageService.removeImage,
  })
}

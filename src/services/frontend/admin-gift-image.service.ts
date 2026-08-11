import { httpClient } from "@/lib/api/client"

export const adminGiftImageService = {
  uploadImage(image: File): Promise<{ image_path: string }> {
    const formData = new FormData()
    formData.set("image", image)

    return httpClient.post<{ image_path: string }>("/api/admin/gift-images", {
      body: formData,
    })
  },

  removeImage(imagePath: string): Promise<null> {
    const searchParams = new URLSearchParams({ path: imagePath })

    return httpClient.delete<null>(`/api/admin/gift-images?${searchParams}`)
  },
}

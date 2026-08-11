import { httpClient } from "@/lib/api/client"
import type { Category } from "@/types/category"

export const categoryService = {
  getCategories(): Promise<Category[]> {
    return httpClient.get<Category[]>("/api/categories")
  },
}

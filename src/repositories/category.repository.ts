import { supabaseServer } from "@/lib/supabase/server"
import type { Category } from "@/types/category"
import type { RepositoryListResult } from "@/types/repository"

export const CategoryRepository = {
  async findAll(): RepositoryListResult<Category> {
    const { data, error } = await supabaseServer
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      throw error
    }

    return data
  },
}

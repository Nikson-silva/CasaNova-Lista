import { supabaseServer } from "@/lib/supabase/server"
import type { Gift } from "@/types/gift"
import type {
  RepositoryEntityResult,
  RepositoryListResult,
} from "@/types/repository"

export const GiftRepository = {
  async findAll(): RepositoryListResult<Gift> {
    const { data, error } = await supabaseServer
      .from("gifts")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      throw error
    }

    return data
  },

  async findById(id: string): RepositoryEntityResult<Gift> {
    const { data, error } = await supabaseServer
      .from("gifts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      throw error
    }

    return data
  },
}

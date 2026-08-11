import { supabaseServer } from "@/lib/supabase/server"
import type { Gift, GiftInsert, GiftUpdate } from "@/types/gift"
import type {
  RepositoryEntityResult,
  RepositoryListResult,
} from "@/types/repository"

export const AdminGiftRepository = {
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

  async findByDisplayOrder(
    displayOrder: number,
    excludedGiftId?: string,
  ): RepositoryEntityResult<Gift | null> {
    let query = supabaseServer
      .from("gifts")
      .select("*")
      .eq("display_order", displayOrder)

    if (excludedGiftId) {
      query = query.neq("id", excludedGiftId)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      throw error
    }

    return data
  },

  async categoryExists(categoryId: string): Promise<boolean> {
    const { data, error } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data !== null
  },

  async hasActiveReservation(giftId: string): Promise<boolean> {
    const { count, error } = await supabaseServer
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("gift_id", giftId)
      .is("cancelled_at", null)

    if (error) {
      throw error
    }

    return (count ?? 0) > 0
  },

  async create(data: GiftInsert): RepositoryEntityResult<Gift> {
    const { data: gift, error } = await supabaseServer
      .from("gifts")
      .insert(data)
      .select()
      .single()

    if (error) {
      throw error
    }

    return gift
  },

  async update(id: string, data: GiftUpdate): RepositoryEntityResult<Gift> {
    const { data: gift, error } = await supabaseServer
      .from("gifts")
      .update(data)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return gift
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabaseServer.from("gifts").delete().eq("id", id)

    if (error) {
      throw error
    }
  },
}

import { supabaseServer } from "@/lib/supabase/server"

const GIFTS_BUCKET = "gifts"

export const AdminGiftImageRepository = {
  async upload(path: string, file: Buffer, contentType: string): Promise<void> {
    const { error } = await supabaseServer.storage.from(GIFTS_BUCKET).upload(path, file, {
      contentType,
      upsert: false,
    })

    if (error) {
      throw error
    }
  },

  async remove(path: string): Promise<void> {
    const { error } = await supabaseServer.storage.from(GIFTS_BUCKET).remove([path])

    if (error) {
      throw error
    }
  },

  async countGiftReferences(path: string): Promise<number> {
    const { count, error } = await supabaseServer
      .from("gifts")
      .select("id", { count: "exact", head: true })
      .eq("image_path", path)

    if (error) {
      throw error
    }

    return count ?? 0
  },
}

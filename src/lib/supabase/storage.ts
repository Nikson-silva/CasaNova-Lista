import { supabaseClient } from "@/lib/supabase/client"

const GIFTS_BUCKET = "gifts"

export function getPublicImageUrl(path: string): string {
  const { data } = supabaseClient.storage.from(GIFTS_BUCKET).getPublicUrl(path)

  return data.publicUrl
}

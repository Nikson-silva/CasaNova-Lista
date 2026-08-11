import type {
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database"

export type Gift = Tables<"gifts">
export type GiftInsert = TablesInsert<"gifts">
export type GiftUpdate = TablesUpdate<"gifts">
export type GiftKind = Enums<"gift_kind">
export type GiftStatus = Enums<"gift_status">

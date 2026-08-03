import type { Division } from "@/types/sync.type"

export type DivisionOption = {
  label: string
  value: Division
}

export const division: DivisionOption[] = [
  { label: "Head Office", value: "head_office" },
  { label: "RTM Operations", value: "rtm_operations" },
  { label: "Warehouse", value: "warehouse" },
]

import type { Cluster as ClusterType } from "@/types/sync.type"

type ClusterOptions = {
  label: string
  value: ClusterType
}

export const cluster: ClusterOptions[] = [
  {
    label: "Head Office",
    value: "head_office",
  },
  {
    label: "Mindanao 1",
    value: "mindanao_1",
  },
  {
    label: "Mindanao 2",
    value: "mindanao_2",
  },
  {
    label: "NCR North East",
    value: "ncr_north_east",
  },
  {
    label: "NCR South Calapa",
    value: "ncr_south_calapa",
  },
  {
    label: "North Central Luzon",
    value: "north_central_luzon",
  },
  {
    label: "South Luzon",
    value: "south_luzon",
  },
  {
    label: "Visayas 1",
    value: "visayas_1",
  },
  {
    label: "Visayas 2",
    value: "visayas_2",
  },
  {
    label: "Warehouse",
    value: "warehouse",
  },
]

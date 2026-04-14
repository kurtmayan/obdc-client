type StoreSyncRecord = {
  id: string
  syncDate: Date
  storesId: string
}

type Device = {
  id: string
  model: string
  serialNumber: string
  storesId: string
  createdAt: Date
  updatedAt: Date
}

export type Division = "rtm_operations" | "head_office" | "warehouse"

export type Cluster =
  | "mindanao_1"
  | "mindanao_2"
  | "visayas_1"
  | "visayas_2"
  | "ncr_north_east"
  | "ncr_south_calapa"
  | "south_luzon"
  | "north_central_luzon"
  | "head_office"
  | "warehouse"

export type Status = "active" | "inactive"

export type Store = {
  id: string
  createdAt: Date
  updatedAt: Date
  devices: Device[]
  storeSyncRecords: StoreSyncRecord[]

  code: string
  name: string
  division: Division
  cluster: Cluster
  contactPerson: string
  contactInfo: string | null
  status: Status
  location: string
}

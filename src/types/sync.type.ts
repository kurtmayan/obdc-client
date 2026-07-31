export type SyncStatus = "SUCCESS" | "FAILED" | "PENDING" | "PROCESSING"

export type StoreSyncRecord = {
  id: string
  syncDate: Date | string
  storesId: string
  status: SyncStatus
}

export type Device = {
  id: string
  model: string
  serialNumber: string
  storesId?: string
  createdAt?: Date | string
  updatedAt?: Date | string
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
  createdAt: Date | string
  updatedAt: Date | string
  devices: Device[]
  storeSyncRecords: StoreSyncRecord[]
  code?: string | null
  name: string
  division: Division
  cluster: Cluster
  contactPerson?: string | null
  contactNumber?: string | null
  contactInfo?: string | null
  status: Status
  location: string
}
export type DeviceStore = {
  id: string
  name: string
  location: string
}

export type Device = {
  id: string
  serialNumber: string
  model: string
  storesId: string
  status?: "active" | "inactive"
  store?: DeviceStore | null
  stores?: DeviceStore | null
  createdAt?: string
  updatedAt?: string
}

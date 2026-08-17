import { create } from "zustand"

type DeviceManagementState = {
  deviceId: string | null
  openSheet: boolean
  selectedIdToDelete: string | null
  openDelete: boolean
}

type DeviceManagementActions = {
  setOpenSheet: (open: boolean) => void
  setDeviceToEdit: (deviceId: string | null) => void
  setSelectedIdToDelete: (id: string) => void
  setOpenDelete: (open: boolean) => void
}

export type DeviceManagement = DeviceManagementState & DeviceManagementActions

export const deviceManagement = create<DeviceManagement>((set) => ({
  deviceId: null,
  openSheet: false,
  selectedIdToDelete: null,
  openDelete: false,
  setOpenSheet: (openSheet) => {
    if (!openSheet) {
      set({
        deviceId: null,
      })
    }

    set({
      openSheet,
    })
  },
  setDeviceToEdit: (deviceId) => {
    set({
      deviceId,
    })
  },
  setSelectedIdToDelete: (id) => {
    set({
      selectedIdToDelete: id,
    })
  },
  setOpenDelete: (openDelete) => {
    if (!openDelete) {
      set({
        selectedIdToDelete: null,
      })
    }

    set({
      openDelete,
    })
  },
}))

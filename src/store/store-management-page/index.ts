import { create } from "zustand"

type StoreManagementState = {
  storeId: string | null
  openSheet: boolean
  selectedIdToDelete: string | null
  openDelete: boolean
}

type StoreManagementActions = {
  setOpenSheet: (open: boolean) => void
  setStoreToEdit: (storeId: string | null) => void
  setSelectedIdToDelete: (id: string) => void
  setOpenDelete: (open: boolean) => void
}

export type StoreManagement = StoreManagementState & StoreManagementActions

export const storeManagement = create<StoreManagement>((set) => ({
  setOpenDelete: (open) => {
    if (!open) {
      set({
        selectedIdToDelete: null,
      })
    }
    set({
      openDelete: open,
    })
  },
  openDelete: false,
  setSelectedIdToDelete: (id) => {
    set({
      selectedIdToDelete: id,
    })
  },
  selectedIdToDelete: null,
  storeId: null,
  openSheet: false,
  setOpenSheet: (openSheet) => {
    if (!openSheet) {
      set({
        storeId: null,
      })
    }
    set({
      openSheet,
    })
  },
  setStoreToEdit: (storeId) => {
    set({
      storeId,
    })
  },
}))

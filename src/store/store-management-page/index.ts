import { create } from "zustand"

type StoreManagementState = {
  storeId: string | null
  openSheet: boolean
}

type StoreManagementActions = {
  setOpenSheet: (open: boolean) => void
  setStoreToEdit: (storeId: string | null) => void
}

export type StoreManagement = StoreManagementState & StoreManagementActions

export const storeManagement = create<StoreManagement>((set) => ({
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

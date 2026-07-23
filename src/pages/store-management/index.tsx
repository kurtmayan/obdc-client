import { Button } from "@/components/ui/button"
import StoreSheet from "./store-sheet"
import StoreManagementTable from "./table"
import { Plus } from "lucide-react"
import { storeManagement } from "@/store/store-management-page"

export default function StoreManagementPage() {
  const { setOpenSheet, setStoreToEdit } = storeManagement()

  const handleCreateNewStore = () => {
    setStoreToEdit(null)
    setOpenSheet(true)
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Store Management</p>
          <p className="text-[14px] text-[#8A96A3]">
            Manage biometric devices and store assignments
          </p>
        </div>
        <Button className="h-10.75 w-49.5" onClick={handleCreateNewStore}>
          <Plus />
          Enroll New Store
        </Button>
      </div>
      <div className="rounded-[6px] bg-white shadow-xs">
        <StoreManagementTable />
      </div>
      <StoreSheet />
    </div>
  )
}

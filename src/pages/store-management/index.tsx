import { Button } from "@/components/ui/button"
import StoreSheet from "./store-sheet"
import StoreManagementTable from "./table"
import { Plus } from "lucide-react"
import { storeManagement } from "@/store/store-management-page"
import StoreDeactivationNotice from "./store-deactivation-notice"
import { useQuery } from "@tanstack/react-query"
import type { Permissions } from "@/types/permission"

export default function StoreManagementPage() {
  const { setOpenSheet, setStoreToEdit } = storeManagement()

  const handleCreateNewStore = () => {
    setStoreToEdit(null)
    setOpenSheet(true)
  }

  const { data: permission } = useQuery<Permissions>({
    queryKey: ["permission"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/permission`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      return data
    },
  })

  return (
    <div className="grid gap-3">
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Store Management</p>
          <p className="text-[14px] text-[#8A96A3]">
            Manage biometric devices and store assignments
          </p>
        </div>
        <Button
          className="h-10.75 w-49.5"
          onClick={handleCreateNewStore}
          disabled={!permission?.storeManagement.canCreate}
        >
          <Plus />
          Enroll New Store
        </Button>
      </div>
      <div className="rounded-[6px] bg-white shadow-xs">
        <StoreManagementTable />
      </div>
      <StoreSheet />
      <StoreDeactivationNotice />
    </div>
  )
}

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { deviceManagement } from "@/store/device-management-page"
import DeviceDeactivateNotice from "./device-deactivate-notice"
import DeviceSheet from "./device-sheet"
import DeviceManagementTable from "./table"
import { useQuery } from "@tanstack/react-query"
import type { Permissions } from "@/types/permission"

export default function DeviceManagementPage() {
  const { setOpenSheet, setDeviceToEdit } = deviceManagement()

  const handleCreateNewDevice = () => {
    setDeviceToEdit(null)
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
          <p className="text-lg font-semibold">Device Management</p>
          <p className="text-[14px] text-[#8A96A3]">
            Manage biometric devices and their connected stores
          </p>
        </div>
        <Button
          className="h-10.75 w-49.5"
          onClick={handleCreateNewDevice}
          disabled={!permission?.deviceManagement.canCreate}
        >
          <Plus />
          Enroll New Device
        </Button>
      </div>
      <div className="rounded-[6px] bg-white shadow-xs">
        <DeviceManagementTable />
      </div>
      <DeviceSheet />
      <DeviceDeactivateNotice />
    </div>
  )
}

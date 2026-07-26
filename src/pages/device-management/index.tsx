import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { deviceManagement } from "@/store/device-management-page"
import DeviceDeleteNotice from "./device-delete-notice"
import DeviceSheet from "./device-sheet"
import DeviceManagementTable from "./table"

export default function DeviceManagementPage() {
  const { setOpenSheet, setDeviceToEdit } = deviceManagement()

  const handleCreateNewDevice = () => {
    setDeviceToEdit(null)
    setOpenSheet(true)
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Device Management</p>
          <p className="text-[14px] text-[#8A96A3]">
            Manage biometric devices and their connected stores
          </p>
        </div>
        <Button className="h-10.75 w-49.5" onClick={handleCreateNewDevice}>
          <Plus />
          Enroll New Device
        </Button>
      </div>
      <div className="rounded-[6px] bg-white shadow-xs">
        <DeviceManagementTable />
      </div>
      <DeviceSheet />
      <DeviceDeleteNotice />
    </div>
  )
}

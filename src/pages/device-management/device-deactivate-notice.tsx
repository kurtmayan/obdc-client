import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { deviceManagement } from "@/store/device-management-page"
import { useDeactivateDevice } from "./actions"

export default function DeviceDeactivateNotice() {
  const [confirmation, setConfirmation] = useState("")
  const deviceIdToDelete = deviceManagement((s) => s.selectedIdToDelete)
  const open = deviceManagement((s) => s.openDelete)
  const { setOpenDelete } = deviceManagement()
  const { mutateAsync: deleteDevice } = useDeactivateDevice()

  const handleOpenChange = (nextOpen: boolean) => {
    setOpenDelete(nextOpen)

    if (!nextOpen) {
      setConfirmation("")
    }
  }

  const handleDeactivate = () => {
    if (!deviceIdToDelete) return

    toast.promise(
      deleteDevice(deviceIdToDelete).then((data) => {
        handleOpenChange(false)
        return data
      }),
      {
        loading: "Deactivating device...",
        success: "Device deactivated successfully!",
        error: "Device cannot be deactivated!",
        position: "top-center",
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="w-83.5">
        <DialogHeader>
          <DialogTitle className="text-center text-[16px] font-bold">
            Are you sure you want to deactivate this device?
          </DialogTitle>
          <DialogDescription className="mx-auto w-66.5 text-center text-xs">
            This will permanently deactivate the device from management.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Type 'deactivate' to deactivate"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={confirmation.toLowerCase() !== "deactivate"}
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

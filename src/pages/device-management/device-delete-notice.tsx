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
import { useDeleteDevice } from "./actions"

export default function DeviceDeleteNotice() {
  const [confirmation, setConfirmation] = useState("")
  const deviceIdToDelete = deviceManagement((s) => s.selectedIdToDelete)
  const open = deviceManagement((s) => s.openDelete)
  const { setOpenDelete } = deviceManagement()
  const { mutateAsync: deleteDevice } = useDeleteDevice()

  const handleOpenChange = (nextOpen: boolean) => {
    setOpenDelete(nextOpen)

    if (!nextOpen) {
      setConfirmation("")
    }
  }

  const handleDelete = () => {
    if (!deviceIdToDelete) return

    toast.promise(
      deleteDevice(deviceIdToDelete).then((data) => {
        handleOpenChange(false)
        return data
      }),
      {
        loading: "Deleting device...",
        success: "Device deleted successfully!",
        error: "Device cannot be deleted!",
        position: "top-center",
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="w-83.5">
        <DialogHeader>
          <DialogTitle className="text-center text-[16px] font-bold">
            Are you sure you want to delete this device?
          </DialogTitle>
          <DialogDescription className="mx-auto w-66.5 text-center text-xs">
            This will permanently remove the device from management.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Type 'delete' to delete"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={confirmation.toLowerCase() !== "delete"}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

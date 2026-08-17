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
import { storeManagement } from "@/store/store-management-page"
import { useState } from "react"
import { useDeactivateStore } from "./actions"
import { toast } from "sonner"

export default function StoreDeactivationNotice() {
  const [confirmation, setConfirmation] = useState("")
  const storeIdToDelete = storeManagement((s) => s.selectedIdToDelete)
  const open = storeManagement((s) => s.openDelete)
  const { setOpenDelete } = storeManagement()
  const { mutateAsync: deactivateStore } = useDeactivateStore()

  const handleDeactivate = () => {
    toast.promise(
      deactivateStore(storeIdToDelete as string).then((data) => {
        setOpenDelete(false)
        return data
      }),
      {
        loading: "Deactivating store...",
        success: "Store deactivated successfully!",
        error: "Store cannot be deactivated!",
        position: "top-center",
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpenDelete}>
      <DialogContent showCloseButton={false} className="w-83.5">
        <DialogHeader>
          <DialogTitle className="text-center text-[16px] font-bold">
            Are you sure you want to deactivate this store?
          </DialogTitle>
          <DialogDescription className="mx-auto w-66.5 text-center text-xs">
            This will stop it from syncing and exclude it from reports.{" "}
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Type 'deactivate' to deactivate this store"
          onChange={(e) => setConfirmation(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
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

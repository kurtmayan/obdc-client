import Filter from "./filter"
import { Outlet, useParams } from "react-router"
import SyncMonitorTable from "./table"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { queryClient } from "@/queryClient"

export default function SyncMonitor() {
  const { storeId } = useParams<{ storeId?: string }>()
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["stores"] })
  }

  if (storeId) {
    return <Outlet />
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <p className="text- text-2xl font-bold">Sync Monitor Overview</p>
          <p className="text-sm text-[#8A96A3]">
            Summary of biometric data synchronization
          </p>
        </div>
        <Button size={"icon"} onClick={handleRefresh}>
          <RefreshCcw />
        </Button>
      </div>

      <div className="bg-white px-6 py-5">
        <Filter />
      </div>

      <div className="bg-white px-6 py-5">
        <SyncMonitorTable />
      </div>
    </div>
  )
}

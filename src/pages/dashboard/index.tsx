import StoreIcon from "@/components/icons/store-icon"
import StatsInfo from "./stats-info"
import CorrectIcon from "@/components/icons/correct-icon"
import AlertIcon from "@/components/icons/alert-icon"
import { ChartTooltipIndicatorNone } from "@/components/chart-tooltip-indicator-none"
import { useQuery } from "@tanstack/react-query"

type StatisticsType = {
  totalStores: number
  totalStoreSynced: number
  totalStoreUnsynced: number
}

export default function Dashboard() {
  const { data: dataStatistics } = useQuery<StatisticsType>({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/statistics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      return data
    },
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <p className="text- text-2xl font-bold">Sync Sync Overview</p>
          <p className="text-sm text-[#8A96A3]">Overview of all stores</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <StatsInfo
          title="Total Stores"
          value={`${dataStatistics?.totalStores || 0}`}
          description="Total stores being monitored"
          icon={<StoreIcon />}
        />
        <StatsInfo
          title="Stores Synced"
          value={`${dataStatistics?.totalStoreSynced || 0}`}
          description="Number of stores successfully synced"
          icon={<CorrectIcon />}
        />
        <StatsInfo
          title="Stores Unsynced"
          value={`${dataStatistics?.totalStoreUnsynced || 0}`}
          description="Number of stores pending or failed sync"
          icon={<AlertIcon />}
        />
      </div>

      <div className="bg-white px-6 py-5">
        <ChartTooltipIndicatorNone />
      </div>
    </div>
  )
}

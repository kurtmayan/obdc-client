import StoreIcon from "@/components/icons/store-icon"
import StatsInfo from "./stats-info"
import CorrectIcon from "@/components/icons/correct-icon"
import { ChartTooltipIndicatorNone } from "@/components/chart-tooltip-indicator-none"
import { useQuery } from "@tanstack/react-query"

type StatisticsType = {
  totalStores: number
  totalUnsyncedStores: number
  activeStores: number
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
          <p className="text- text-2xl font-bold">Dashboard Overview</p>
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
          title="Active Stores"
          value={`${dataStatistics?.activeStores || 0}`}
          description="Number of active stores"
          icon={<CorrectIcon />}
        />
        <StatsInfo
          title="Synced Stores"
          value={`${dataStatistics?.totalUnsyncedStores || 0}`}
          description="Number of sycned stores."
          icon={<CorrectIcon />}
        />
      </div>

      <div className="bg-white px-6 py-5">
        <ChartTooltipIndicatorNone />
      </div>
    </div>
  )
}

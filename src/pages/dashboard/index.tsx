import StoreIcon from "@/components/icons/store-icon"
import StatsInfo from "./stats-info"
import CorrectIcon from "@/components/icons/correct-icon"
import AlertIcon from "@/components/icons/alert-icon"
import { ChartTooltipIndicatorNone } from "@/components/chart-tooltip-indicator-none"

export default function Dashboard() {
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
          value="1,000"
          description="Total stores being monitored"
          icon={<StoreIcon />}
        />
        <StatsInfo
          title="Stores Synced"
          value="980"
          description="Number of stores successfully synced"
          icon={<CorrectIcon />}
        />
        <StatsInfo
          title="Stores Unsynced"
          value="20"
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

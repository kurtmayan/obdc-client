import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { capitalize } from "@/lib/capitalize"
import Filter from "./filter"
import StoreIcon from "@/components/icons/store-icon"
import StatsInfo from "./stats-info"
import CorrectIcon from "@/components/icons/correct-icon"
import AlertIcon from "@/components/icons/alert-icon"
import { STATUS_CONFIG } from "@/constant/status"
import { format, formatDistanceToNow } from "date-fns"

export type SyncType = {
  id: string
  location: string
  region: string
  lastSync: Date
  pending: number
  status: "synced" | "syncing" | "failed"
}

const dummyData: SyncType[] = [
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date("March 10 2024, 10:00 AM"),
    pending: 0,
    status: "synced",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    pending: 0,
    status: "synced",
  },

  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    pending: 25,
    status: "failed",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    pending: 0,
    status: "synced",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    pending: 28,
    status: "failed",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    pending: 16,
    status: "syncing",
  },
]

const dummyHeader = ["location", "region", "last sync", "pending", "status"]

export default function Overview() {
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
        <Filter />
      </div>

      <div className="bg-white px-6 py-5">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F6F7F9]">
              {dummyHeader.map((header) => (
                <TableHead
                  className="text-center text-xs font-semibold tracking-[0.5px] text-navy-blue uppercase first:text-left"
                  key={header}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyData.map(
              ({ id, location, region, lastSync, pending, status }, index) => {
                const statusConfig = STATUS_CONFIG[status]
                return (
                  <TableRow key={index}>
                    <TableCell className="items-center gap-2">
                      <p className="text-sm font-semibold text-navy-blue">
                        {location}
                      </p>
                      <p className="text-xs font-normal text-[#8A96A3]">{id}</p>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <p className="text-sm font-medium text-navy-blue">
                          {region}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-sm font-medium text-navy-blue">
                            {format(lastSync, "MMMM d, h:mm a")}
                          </p>
                          <p className="text-xs font-normal text-[#8A96A3]">
                            {formatDistanceToNow(lastSync, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>{pending}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <Badge
                            className={`flex items-center gap-1 ${statusConfig.className}`}
                          >
                            <statusConfig.icon />
                            {capitalize(statusConfig.label)}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

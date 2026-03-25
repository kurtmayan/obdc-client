import SyncIcon from "@/components/icons/sync-icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { capitalize } from "@/lib/capitalize"
import { CloudSync } from "lucide-react"
import Filter from "./filter"

export type Time = {
  date: string
  time: string
}

export type Logs = {
  name: string
  timeIn: Time
  timeOut: Time
}

export type SyncType = {
  id: string
  location: string
  region: string
  lastSync: string
  status: "synced" | "syncing" | "failed"
}

const dummyData: SyncType[] = [
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: "March 10, 8:00 AM",
    status: "synced",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: "March 10, 8:00 AM",
    status: "synced",
  },

  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: "March 10, 8:00 AM",
    status: "failed",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: "March 10, 8:00 AM",
    status: "synced",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: "March 10, 8:00 AM",
    status: "failed",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: "March 10, 8:00 AM",
    status: "syncing",
  },
]

const dummyHeader = ["location", "region", "last sync", "status", "action"]

const STATUS_CONFIG = {
  synced: {
    label: "synced",
    className: "bg-[#D4FDE7] text-green-700",
  },
  syncing: {
    label: "syncing",
    className: "bg-[#FFF4C2] text-[#9E3900]",
  },
  failed: {
    label: "failed",
    className: "bg-[#FFE1E2] text-[#A8000F]",
  },
} as const

export default function SyncMonitor() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <p className="text- text-2xl font-bold">Sync Monitor Overview</p>
          <p className="text-sm text-[#8A96A3]">
            Summary of biometric data synchronization
          </p>
        </div>
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
              ({ id, location, region, lastSync, status }, index) => {
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
                            {lastSync}
                          </p>
                          <p className="text-xs font-normal text-[#8A96A3]">
                            {lastSync}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <Badge className={statusConfig.className}>
                            {capitalize(statusConfig.label)}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div className="flex flex-row">
                          <div>
                            <Button variant={"outline"}>
                              <SyncIcon height={6} width={6} />
                              Retry
                            </Button>
                          </div>
                          <Button variant={"outline"}>View</Button>
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

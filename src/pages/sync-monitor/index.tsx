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
import Filter from "./filter"
import { Outlet, useParams, useNavigate } from "react-router"
import { STATUS_CONFIG } from "@/constant/status"
import { format, formatDistanceToNow } from "date-fns"
import { useQuery } from "@tanstack/react-query"

export type SyncType = {
  id: string
  location: string
  region: string
  lastSync: Date
  status: "synced" | "syncing" | "failed"
}

const dummyData: SyncType[] = [
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    status: "synced",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    status: "synced",
  },

  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    status: "failed",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    status: "synced",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    status: "failed",
  },
  {
    id: "ID: DIY-STM-004",
    location: "Manila",
    region: "NCR",
    lastSync: new Date(),
    status: "syncing",
  },
]

export interface StoreLocation {
  storeName: string
  region: string
}

export interface StoreAttendance {
  deviceId: string
  storeLoc: StoreLocation
  lastSync: string // ISO date string
  status: "synced" | "pending" | "failed" // extend if needed
  attendance: AttendanceRecord[]
}

export type LogType = "timeIn" | "timeOut" // extend if needed

export interface AttendanceRecord {
  id: string
  employeeName: string
  createdAt: string // ISO date
  updatedAt: string // ISO date
  logType: LogType
  logDate: string // ISO date
  storeSyncRecordID: string
}

export interface Device {
  id: string
  model: string
  serialNumber: string
  storesId: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface Store {
  id: string
  name: string
  region: string
  province: string
  municipality: string
  barangay: string
  exactAddress: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  contactInfo: string | null
  devices: Device[]
}

export interface SyncRecord {
  id: string
  syncDate: string // ISO date string
  storesId: string
  attendanceRecord: AttendanceRecord[]
  store: Store
}

const dummyHeader = ["location", "region", "last sync", "status", "action"]

export default function SyncMonitor() {
  const navigate = useNavigate()
  const params = useParams()
  const { data, isLoading, isError } = useQuery<SyncRecord[]>({
    queryKey: ["sync-data"],
    queryFn: async () => {
      const data = await fetch("http://localhost:3000/attendance/all")
      console.log(data)
      return await data.json()
    },
  })

  console.log(data)

  const handleClick = (
    syncId: string,
    attendanceRecord: AttendanceRecord[]
  ) => {
    navigate(`/sync-monitor/${syncId}`, {
      state: { data: attendanceRecord }, // 👈 pass the data here
    })
  }

  if (isLoading) return <p>Loading....</p>
  if (isError) throw new Error()
  if (!data) throw new Error()

  if (params.location) {
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
            {data.map(({ syncDate, store, attendanceRecord, id }, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="items-center gap-2">
                    <p className="text-sm font-semibold text-navy-blue">
                      {store.name}
                    </p>
                    <p className="text-xs font-normal text-[#8A96A3]">
                      {store.devices[0].model} - {store.devices[0].serialNumber}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="grid place-items-center">
                      <p className="text-sm font-medium text-navy-blue">
                        {store.region}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid place-items-center">
                      <div>
                        <p className="text-sm font-medium text-navy-blue">
                          {format(syncDate, "MMMM d, h:mm a")}
                        </p>
                        <p className="text-xs font-normal text-[#8A96A3]">
                          {formatDistanceToNow(syncDate, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid place-items-center">
                      <div>
                        <Badge
                          className={`flex items-center gap-1 bg-green-400 text-white`}
                        >
                          {capitalize(status)}
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
                        <Button
                          variant={"outline"}
                          onClick={() => handleClick(id, attendanceRecord)}
                          // onClick={() =>
                          // navigate({
                          //   to: `/sync-monitor/${storeLoc.storeName}`,
                          //   replace: true,
                          //   state: attendance as any,
                          // })
                          // }
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

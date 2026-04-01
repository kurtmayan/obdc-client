import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLocation } from "react-router"
import type { AttendanceRecord } from ".."

export type SyncType = {
  id: string
  logDate: Date
  totalRecord: number
  synced: number
  pending: number
  lastSync: Date
  status: "synced" | "syncing" | "failed"
}

const dummyData: SyncType[] = [
  {
    id: "ID: DIY-STM-004",
    logDate: new Date(),
    totalRecord: 12,
    synced: 30,
    pending: 0,
    lastSync: new Date(),
    status: "synced",
  },
  {
    id: "ID: DIY-STM-123",
    logDate: new Date(),
    totalRecord: 12,
    synced: 30,
    pending: 0,
    lastSync: new Date(),
    status: "synced",
  },
  {
    id: "ID: DIY-STM-632",
    logDate: new Date(),
    totalRecord: 12,
    synced: 30,
    pending: 0,
    lastSync: new Date(),
    status: "synced",
  },
  {
    id: "ID: DIY-STM-249",
    logDate: new Date(),
    totalRecord: 12,
    synced: 30,
    pending: 0,
    lastSync: new Date(),
    status: "synced",
  },
  {
    id: "ID: DIY-STM-231",
    logDate: new Date(),
    totalRecord: 12,
    synced: 30,
    pending: 0,
    lastSync: new Date(),
    status: "synced",
  },
]

const dummyHeader = ["employee", "mode", "date"]

export default function SyncMonitorLocation() {
  const { state } = useLocation()

  const data = state.data as AttendanceRecord[]
  console.log(data)
  return (
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
        {data?.map(({ employeeName, logDate, logType }, index) => {
          return (
            <TableRow key={index}>
              <TableCell className="items-center gap-2">
                <p className="text-sm font-semibold text-navy-blue">
                  {employeeName}
                </p>
              </TableCell>
              <TableCell>
                <div className="grid place-items-center">
                  <p className="text-sm font-medium text-navy-blue">
                    {logType}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid place-items-center">
                  <div>
                    <p className="text-sm font-medium text-navy-blue">
                      {logDate.toLocaleString()}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

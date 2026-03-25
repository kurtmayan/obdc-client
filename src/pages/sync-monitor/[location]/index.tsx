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
import { format } from "date-fns"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { STATUS_CONFIG } from "@/constant/status"

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

const dummyHeader = [
  "log date",
  "total record",
  "synced",
  "pending",
  "last sync",
  "status",
  "action",
]

export default function SyncMonitorLocation() {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white px-6 py-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-sm font-medium text-black/50">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-black">
                Store #004 Malolos Bayan
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="bg-white px-6 py-5">
        <h2 className="text-2xl font-medium">Store #004 Malolos Bayan</h2>
        <p className="text-xs font-normal text-[#8A96A3]">ID: DIY-MLS-001</p>
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
              (
                { lastSync, logDate, pending, status, synced, totalRecord },
                index
              ) => {
                const statusConfig = STATUS_CONFIG[status]
                return (
                  <TableRow key={index} className="h-20">
                    <TableCell className="items-center gap-2">
                      <p className="text-xs font-semibold text-navy-blue">
                        {format(logDate, "MMMM d, yyyy")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <p className="text-xs font-medium text-navy-blue">
                          {totalRecord}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-xs font-medium text-navy-blue">
                            {synced}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-xs font-medium text-navy-blue">
                            {pending}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-xs font-medium text-navy-blue">
                            {format(lastSync, "MMMM d, h:mm a")}
                          </p>
                        </div>
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

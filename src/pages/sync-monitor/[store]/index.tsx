import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import EyeIcon from "@/components/icons/eye-icon"
import { formatDate } from "date-fns"
import { useNavigate } from "react-router"

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
    id: "sync-001",
    logDate: new Date("2026-04-12T08:00:00Z"),
    totalRecord: 120,
    synced: 120,
    pending: 0,
    lastSync: new Date("2026-04-01T08:30:00Z"),
    status: "synced",
  },
  {
    id: "sync-002",
    logDate: new Date("2026-04-01T09:00:00Z"),
    totalRecord: 85,
    synced: 50,
    pending: 35,
    lastSync: new Date("2026-04-01T09:20:00Z"),
    status: "syncing",
  },
  {
    id: "sync-003",
    logDate: new Date("2026-04-01T10:00:00Z"),
    totalRecord: 200,
    synced: 180,
    pending: 20,
    lastSync: new Date("2026-04-01T10:25:00Z"),
    status: "failed",
  },
  {
    id: "sync-004",
    logDate: new Date("2026-04-01T11:00:00Z"),
    totalRecord: 150,
    synced: 150,
    pending: 0,
    lastSync: new Date("2026-04-01T11:15:00Z"),
    status: "synced",
  },
  {
    id: "sync-005",
    logDate: new Date("2026-04-01T12:00:00Z"),
    totalRecord: 90,
    synced: 45,
    pending: 45,
    lastSync: new Date("2026-04-01T12:10:00Z"),
    status: "syncing",
  },
]

const header = [
  "log date",
  "total record",
  "synced",
  "pending",
  "last sync",
  "status",
  "action",
]

export default function SyncMonitorStoreView() {
  const navigate = useNavigate()

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
        <div className="mt-4 flex gap-5">
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">
              Device Model
            </p>
            <p className="text-sm font-normal">ZKTeco F18</p>
          </div>
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">Status</p>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-normal">Synced</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white px-6 py-5">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F6F7F9]">
              {header.map((header) => (
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
            {dummyData?.map(
              (
                { logDate, totalRecord, synced, pending, lastSync, status },
                index
              ) => {
                return (
                  <TableRow key={index} className="h-16">
                    <TableCell className="items-center gap-2">
                      <p className="text-xs font-semibold text-navy-blue">
                        {formatDate(logDate, "MMMM d, yyyy")}
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
                            {formatDate(lastSync, "MMMM d, yyyy, h:mm:ss a")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-xs font-medium text-navy-blue">
                            {status}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <Button
                            variant={"outline"}
                            onClick={() => navigate("/sync-monitor/store/logs")}
                          >
                            <EyeIcon />
                          </Button>
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

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
import { Badge } from "@/components/ui/badge"
import { format, formatDate } from "date-fns"

import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import SearchIcon from "@/components/icons/search-icon"
import { useNavigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import type { Store } from "../.."
import type { SyncLog } from ".."
import { useState } from "react"

type AttendanceRecord = {
  id: string
  userId?: string
  employeeName: string
  createdAt: Date
  updatedAt: Date
  logType: "timeIn" | "timeOut"
  logDate: Date
  storeSyncRecordID: string
}

type StoreSyncRecordWithAttendance = {
  id: string
  syncDate: Date
  storesId: Date
  attendanceRecord: AttendanceRecord[]
}

const tableHeader = ["employee", "mode", "date"]

export default function SyncMonitorDetailedView() {
  const navigate = useNavigate()
  const { storeId, detailedId } = useParams<{
    storeId: string
    detailedId: string
  }>()
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store`
      )
      return res.json()
    },
  })

  const {
    data: syncLogData,
    isLoading: syncLoading,
    isError: syncError,
  } = useQuery<SyncLog[]>({
    queryKey: ["sync-logs", storeId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store/${storeId}`
      )
      return res.json()
    },
    enabled: !!storeId,
  })

  const {
    data: attendanceData,
    isLoading: detailLoading,
    isError: detailError,
  } = useQuery<StoreSyncRecordWithAttendance>({
    queryKey: ["attendance", storeId, detailedId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store/${storeId}/${detailedId}`
      )
      return res.json()
    },
    enabled: !!storeId && !!detailedId,
  })

  const store = storeData?.find((s) => s.id === storeId)
  const syncLog = syncLogData?.find((log) => log.id === detailedId)
  const filteredAttendance = attendanceData?.attendanceRecord?.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isLoading = storeLoading || syncLoading || detailLoading
  const isError = storeError || syncError || detailError

  if (isLoading) return <p>Loading....</p>
  if (isError || !store || !syncLog || !attendanceData)
    return <p>Error loading data</p>

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
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
              <BreadcrumbPage
                className="cursor-pointer text-sm font-medium text-black/50"
                onClick={() => navigate(-1)}
              >
                Store {store.name} {store.municipality}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-black">
                Logs for {format(syncLog.logDate, "MMMM d, yyyy")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Store Info */}
      <div className="bg-white px-6 py-5">
        <h2 className="text-2xl font-medium">
          Store {store.name} {store.municipality}
        </h2>
        <p className="text-xs font-normal text-[#8A96A3]">
          Store ID: {store.code}
        </p>
        <div className="mt-4 flex gap-5">
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">
              Device Model
            </p>
            <p className="text-sm font-normal">
              {store.devices?.[0]?.model || "N/A"}
            </p>
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

      {/* Attendance Records Table */}
      <div className="bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-nowrap text-[#1F1F1F]">
              Logs for {format(syncLog.logDate, "MMMM d, yyyy")}
            </h1>
            <Badge className="bg-[#D4FDE7] text-[#00662D]">
              {attendanceData.attendanceRecord.length} /{" "}
              {attendanceData.attendanceRecord.length} Synced
            </Badge>
          </div>
          <Field className="w-55.75">
            <InputGroup>
              <InputGroupInput
                placeholder="Search employee name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm placeholder:text-xs placeholder:text-[#00000080]"
              />
              <InputGroupAddon align={"inline-start"}>
                <SearchIcon fill="#00000033" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow className="bg-[#F6F7F9]">
              {tableHeader.map((header) => (
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
            {filteredAttendance?.map(
              ({ employeeName, logDate, logType, userId }, index) => (
                <TableRow key={index} className="h-16">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-semibold text-navy-blue">
                          {employeeName}
                        </p>
                        <p className="text-xs font-normal text-[#8A96A3]">
                          User ID: {userId}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid place-items-center">
                      <p className="text-sm font-medium text-navy-blue">
                        {logType ? "Time In" : "Time Out"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid place-items-center">
                      <p className="text-sm font-medium text-navy-blue">
                        {formatDate(logDate, "hh:mm a")}
                      </p>
                      <p className="text-xs font-normal text-[#8A96A3]">
                        {formatDate(logDate, "MMMM d, yyyy")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "date-fns/format"
import TableData from "@/components/custom/table"

import { formatInTimeZone } from "date-fns-tz"

type AttendanceRecord = {
  id: string
  userId?: string
  employeeName: string
  createdAt: Date
  updatedAt: Date
  logType: number
  logDate: Date
  storeSyncRecordID: string
}

export type StoreSyncRecordWithAttendance = {
  id: string
  syncDate: Date
  storesId: Date
  attendanceRecord: AttendanceRecord[]
}

export default function DetailedViewTable({
  storeId,
  detailedId,
}: {
  storeId: string
  detailedId: string
}) {
  const { data: attendanceData } = useQuery<StoreSyncRecordWithAttendance>({
    queryKey: ["attendance", storeId, detailedId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store/${storeId}/${detailedId}`
      )
      return res.json()
    },
    enabled: !!storeId && !!detailedId,
  })

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        accessorKey: "employeeName",
        header: "Employee",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-left">
            <div>
              <p className="text-sm font-semibold text-navy-blue">
                {row.original.employeeName}
              </p>
              <p className="text-xs font-normal text-[#8A96A3]">
                Employee ID: {row.original.userId}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "logType",
        header: () => (
          <p className="text-left text-sm font-semibold text-navy-blue">Mode</p>
        ),
        cell: ({ row }) => (
          <p className="text-left text-sm font-semibold text-navy-blue">
            {row.original.logType == 0
              ? "Time In"
              : row.original.logType == 1
                ? "Time Out"
                : row.original.logType == 2
                  ? "Undefined"
                  : "Undefined"}
          </p>
        ),
      },
      {
        accessorKey: "logDate",
        header: "Date",
        cell: ({ row }) => {
          return (
            <div className="grid place-items-center">
              <p className="text-sm font-medium text-navy-blue">
                {formatInTimeZone(row.original.logDate, "UTC", "h:mm a")}
              </p>

              <p className="text-xs font-normal text-[#8A96A3]">
                {formatDate(row.original.logDate, "MMMM d, yyyy")}
              </p>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <TableData
      columns={columns}
      data={attendanceData?.attendanceRecord || []}
    />
  )
}

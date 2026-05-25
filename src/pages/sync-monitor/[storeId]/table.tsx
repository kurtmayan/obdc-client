import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { capitalize } from "@/lib/capitalize"
import TableData from "@/components/custom/table"
import { CircleAlert, CircleCheck, ClockFading, Loader } from "lucide-react"
import { cn } from "@/lib/utils"

type SyncLog = {
  id: string
  logDate: Date
  lastSync: Date
  status: string
  pending: number
  totalRecord: number
}

export default function StoreViewTable({ storeId }: { storeId: string }) {
  const { data: dataSyncLog } = useQuery<SyncLog[]>({
    queryKey: ["attendance-store", storeId],
    queryFn: async () => {
      const data = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store/${storeId}`
      )
      return await data.json()
    },
    enabled: !!storeId,
  })

  const columns = useMemo<ColumnDef<SyncLog>[]>(
    () => [
      {
        accessorKey: "logDate",
        header: "Log Date",
        cell: ({ row }) => (
          <p className="text-left text-sm font-semibold text-navy-blue">
            {format(row.original.logDate, "MMMM d, yyyy")}
          </p>
        ),
      },
      {
        accessorKey: "totalRecord",
        header: () => <p>Total Record</p>,
        cell: ({ row }) => (
          <p className="text-navy-blue">{row.original.totalRecord}</p>
        ),
      },
      {
        accessorKey: "totalRecord",
        header: "Synced",
        cell: ({ row }) => (
          <p className="text-center text-sm text-navy-blue">
            {row.original.totalRecord}
          </p>
        ),
      },
      {
        accessorKey: "lastSync",
        header: "Last Sync",
        cell: ({ row }) => (
          <p className="text-center text-sm text-navy-blue">
            {format(row.original.lastSync, "MMMM d, yyyy h:mm a")}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status

          const success = status === "SUCCESS"
          const failed = status === "FAILED"
          const processing = status === "PROCESSING"
          const pending = status === "PENDING"

          const Icon = success
            ? CircleCheck
            : failed
              ? CircleAlert
              : pending
                ? ClockFading
                : processing
                  ? Loader
                  : CircleAlert

          return (
            <div className="flex justify-center">
              <Badge
                className={cn(
                  "flex items-center gap-1 capitalize",
                  success
                    ? "bg-[#D4FDE7] text-[#00662D]"
                    : failed
                      ? "bg-[#FFE1E2] text-[#A8000F]"
                      : pending
                        ? "bg-[#FFF4D6] text-[#8A5A00]"
                        : processing
                          ? "bg-[#D9ECFF] text-[#0057B7]"
                          : "text-black"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {status.toLowerCase()}
              </Badge>
            </div>
          )
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <p className="text-center">
            <Link
              to={`/sync-monitor/${storeId}/${row.original.id}`}
              className="rounded-sm border px-2 py-1 text-center"
            >
              View
            </Link>
          </p>
        ),
      },
    ],
    [storeId]
  )

  return <TableData columns={columns} data={dataSyncLog ?? []} />
}

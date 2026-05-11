import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { capitalize } from "@/lib/capitalize"
import TableData from "@/components/custom/table"

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
        accessorKey: "pending",
        header: "Pending",
        cell: ({ row }) => (
          <p className="text-center text-sm text-navy-blue">
            {row.original.pending}
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
        cell: ({ row }) => (
          <Badge className={`flex items-center gap-1 bg-green-400 text-white`}>
            {capitalize(row.original.status)}
          </Badge>
        ),
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
    []
  )

  return <TableData columns={columns} data={dataSyncLog ?? []} />
}

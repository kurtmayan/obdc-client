import { useEffect, useMemo } from "react"
import TableData from "@/components/custom/table"
import type { Cluster, Division } from "@/types/sync.type"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"
import { Link } from "react-router"
import { useFilterStore } from "@/store/useSyncMonitor"
import { Badge } from "@/components/ui/badge"
import { CircleAlert, CircleCheck, ClockFading, Loader } from "lucide-react"
import { cn } from "@/lib/utils"

const clusterMap: Record<Cluster, string> = {
  head_office: "Head Office",
  mindanao_1: "Mindanao 1",
  mindanao_2: "Mindanao 2",
  ncr_north_east: "NCR North & East",
  ncr_south_calapa: "NCR South & CALAPA",
  north_central_luzon: "North & Central Luzon",
  south_luzon: "South Luzon",
  visayas_1: "Visayas 1",
  visayas_2: "Visayas 2",
  warehouse: "Warehouse",
}

const divisionMap: Record<Division, string> = {
  head_office: "Head Office",
  rtm_operations: "RTM Operations",
  warehouse: "Warehouse",
}

type Store = {
  id: string
  createdAt: Date
  updatedAt: Date
  code: string
  name: string
  division: Division
  location: string
  cluster: Cluster
  contactPerson: string
  contactNumber: string
  status: "ACTIVE" | "INACTIVE"
  storeSyncRecords: StoreSyncRecord[]
  devices: Device[]
}

type StoreSyncRecord = {
  id: string
  syncDate: Date
  storesId: string
  status: "SUCCESS" | "FAILED" | "PENDING" | "PROCESSING"
}

type Device = {
  id: string
  model: string
  serialNumber: string
  storesId: string
  createdAt: Date
  updatedAt: Date
}

export default function SyncMonitorTable() {
  const { clearFilters } = useFilterStore()

  const columnFilters = useFilterStore((s) => s.columnFilters)

  const { data = [] } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      return res.json()
    },
  })

  const columns = useMemo<ColumnDef<Store>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <p className="text-left text-sm font-semibold text-navy-blue">
            {row.original.name}
          </p>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <p className="text-navy-blue">{row.original.location}</p>
        ),
      },
      {
        accessorKey: "cluster",
        header: "Cluster",
        cell: ({ row }) => (
          <p className="text-center text-sm text-navy-blue">
            {clusterMap[row.original.cluster]}
          </p>
        ),
        filterFn: (row, _, filterValue) => {
          return row.original.cluster === filterValue
        },
      },
      {
        accessorKey: "division",
        header: "Division",
        cell: ({ row }) => (
          <p className="text-center text-sm text-navy-blue">
            {divisionMap[row.original.division]}
          </p>
        ),
        filterFn: (row, _, filterValue) => {
          return row.original.division === filterValue
        },
      },
      {
        accessorKey: "lastSync",
        header: "Last Sync",
        cell: ({ row }) => (
          <div className="text-center">
            <p className="text-sm font-medium text-navy-blue">
              {row.original.storeSyncRecords.length != 0 &&
                format(
                  new Date(row.original.storeSyncRecords[0]?.syncDate),
                  "MMMM d, h:mm a"
                )}
            </p>
            <p className="text-xs font-normal text-[#8A96A3]">
              {row.original.storeSyncRecords.length != 0 &&
                formatDistanceToNow(
                  new Date(row.original.storeSyncRecords[0]?.syncDate),
                  {
                    addSuffix: true,
                  }
                )}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const record = row.original.storeSyncRecords?.[0]
          if (!record) return null

          const status = record.status

          const success = status === "SUCCESS"
          const failed = status === "FAILED"
          const pending = status === "PENDING"
          const processing = status === "PROCESSING"

          const Icon = success
            ? CircleCheck
            : failed
              ? CircleAlert
              : pending
                ? ClockFading
                : processing
                  ? Loader
                  : CircleAlert

          const className = cn(
            "flex items-center gap-1 text-xs font-semibold",
            success
              ? "bg-[#D4FDE7] text-[#00662D]"
              : failed
                ? "bg-[#FFE1E2] text-[#A8000F]"
                : pending
                  ? "bg-[#FFF4D6] text-[#8A5A00]"
                  : processing
                    ? "bg-[#D9ECFF] text-[#0057B7]"
                    : "text-black"
          )

          return (
            <div className="flex justify-center">
              <Badge className={className}>
                <Icon className="h-3.5 w-3.5" />
                {status}
              </Badge>
            </div>
          )
        },
        filterFn: (row, _, filterValue) => {
          const record = row.original.storeSyncRecords?.[0]
          if (!record) return false
          return record.status === filterValue
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <p className="text-center">
            <Link
              to={`/sync-monitor/${row.original.id}`}
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

  useEffect(() => {
    return () => clearFilters()
  }, [clearFilters])

  return (
    <TableData columns={columns} data={data} columnFilters={columnFilters} />
  )
}

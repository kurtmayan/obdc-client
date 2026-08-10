import DataTable from "@/components/custom/data-table"
import Pagination from "@/components/custom/pagination"
import SearchInput from "@/components/custom/search-input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { Cluster, Division, Store } from "@/types/sync.type"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"
import { CircleAlert, CircleCheck, ClockFading, Loader } from "lucide-react"
import { useMemo } from "react"
import { Link, useSearchParams } from "react-router"

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

type SyncMonitorData = {
  items: Store[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

const EMPTY_SYNC_MONITOR_DATA: SyncMonitorData = {
  items: [],
  page: 1,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
}

export default function SyncMonitorTable() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get("page") ?? "1"
  const pageSize = searchParams.get("pageSize") ?? "10"
  const q = searchParams.get("q") ?? ""
  const division = searchParams.get("division") ?? ""
  const cluster = searchParams.get("cluster") ?? ""
  const status = searchParams.get("status") ?? ""
  const startDate = searchParams.get("startDate") ?? ""
  const endDate = searchParams.get("endDate") ?? ""

  const {
    data = EMPTY_SYNC_MONITOR_DATA,
    isLoading,
    error,
  } = useQuery<SyncMonitorData>({
    queryKey: [
      "sync-monitor",
      page,
      pageSize,
      q,
      division,
      cluster,
      status,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const { data } = await api.get<SyncMonitorData>("/attendance/store", {
        params: {
          page,
          pageSize,
          q: q || undefined,
          division: division || undefined,
          cluster: cluster || undefined,
          status: status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      })
      return data
    },
    placeholderData: (prev) => prev,
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
      },
      {
        accessorKey: "division",
        header: "Division",
        cell: ({ row }) => (
          <p className="text-center text-sm text-navy-blue">
            {divisionMap[row.original.division]}
          </p>
        ),
      },
      {
        accessorKey: "lastSync",
        header: "Last Sync",
        cell: ({ row }) => {
          const record = row.original.storeSyncRecords?.[0]

          if (!record) {
            return <p className="text-sm text-[#8A96A3]">No sync yet</p>
          }

          const syncDate = new Date(record.syncDate)

          return (
            <div className="text-center">
              <p className="text-sm font-medium text-navy-blue">
                {format(syncDate, "MMMM d, h:mm a")}
              </p>
              <p className="text-xs font-normal text-[#8A96A3]">
                {formatDistanceToNow(syncDate, { addSuffix: true })}
              </p>
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const record = row.original.storeSyncRecords?.[0]
          if (!record) return <p className="text-sm text-[#8A96A3]">No sync</p>

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

  return (
    <div className="grid gap-6 p-6">
      <div className="flex flex-row justify-end">
        <SearchInput />
      </div>
      <DataTable
        data={data.items}
        columns={columns}
        isLoading={isLoading}
        error={error}
      />
      <Separator />
      <Pagination
        page={data.page}
        total={data.totalItems}
        pageSize={data.pageSize}
      />
    </div>
  )
}

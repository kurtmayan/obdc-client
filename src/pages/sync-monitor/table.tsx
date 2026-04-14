import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Updater,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format, formatDistanceToNow } from "date-fns"
import { Link } from "react-router"
import type { Cluster, Division, Store } from "@/types/sync.type"
import { useFilterStore } from "@/store"

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

export default function SyncMonitorTable() {
  const { columnFilters, setFilter } = useFilterStore()

  const handleFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const next =
      typeof updater === "function" ? updater(columnFilters) : updater
    next.forEach((f) => setFilter(f.id, f.value))
  }

  const { data = [], isLoading } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store`
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
          <p className="text-sm font-semibold text-navy-blue">
            {row.original.name}
          </p>
        ),
      },
      {
        accessorKey: "location",
        header: () => <p className="text-start">Location</p>,
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnFilters },
    onColumnFiltersChange: handleFiltersChange,
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <Table>
      <TableHeader className="bg-muted/75">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-[#F6F7F9]">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-center text-xs font-semibold tracking-[0.5px] text-navy-blue uppercase first:text-left"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-10 text-center text-sm text-gray-500"
            >
              Loading...
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-10 text-center text-sm text-gray-500"
            >
              No Data Available!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

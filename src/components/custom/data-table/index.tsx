import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading?: boolean
  error: Error | null
}

export default function DataTable<T>({
  data,
  columns,
  isLoading = false,
  error,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns().length || 1

  const renderTableBody = () => {
    if (error) {
      return (
        <TableRow>
          <TableCell
            colSpan={visibleColumns}
            className="py-6 text-center text-xs font-bold"
            title={error.message}
          >
            Error loading data.
          </TableCell>
        </TableRow>
      )
    }
    if (isLoading) {
      return (
        <TableRow>
          <TableCell
            colSpan={visibleColumns}
            className="py-6 text-center text-xs font-bold"
          >
            Loading...
          </TableCell>
        </TableRow>
      )
    }
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={visibleColumns}
            className="py-6 text-center text-xs font-bold"
          >
            No results found.
          </TableCell>
        </TableRow>
      )
    }
    return rows.map((row) => (
      <TableRow key={row.id} className="border-b">
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className="py-5 text-center text-sm text-gray-500 first:text-left"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  return (
    <Table className="w-full">
      <TableHeader className="bg-muted/75">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-[#F6F7F9]">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-center text-xs font-semibold tracking-[0.5px] text-navy-blue uppercase first:text-left"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>{renderTableBody()}</TableBody>
    </Table>
  )
}

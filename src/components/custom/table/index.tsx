import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPaginationPages } from "@/lib/getPaginationPages"
import { useTableSearch } from "@/store/useTableSearch"
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"

export interface TableDataProps<T> {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  itemsPerPage?: number
  onPaginationChange?: (data: { pageIndex: number; pageSize: number }) => void
  columnFilters?: Array<{ id: string; value: unknown }>
}

export default function TableData<T>({
  data,
  columns,
  itemsPerPage = 7,
  columnFilters = [],
  ...props
}: TableDataProps<T> & React.ComponentProps<"div">) {
  const { setQuery: setSearchQuery, reset: resetSearch } = useTableSearch()
  const selectSearchQuery = useTableSearch((state) => state.query)
  const [searchQuery] = useDebounce(selectSearchQuery, 300)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: itemsPerPage,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      globalFilter: searchQuery,
      ...(columnFilters.length > 0 && { columnFilters }),
    },
    enableFilters: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    onGlobalFilterChange: setSearchQuery,
    onColumnFiltersChange: () => {},
    getFilteredRowModel: getFilteredRowModel(),
  })

  const pages = getPaginationPages(
    table.getState().pagination.pageIndex + 1,
    table.getPageCount()
  )

  useEffect(() => {
    return () => {
      resetSearch()
    }
  }, [resetSearch])

  return (
    <div className="w-full" {...props}>
      <Table className="w-full">
        <TableHeader className="bg-muted/75">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-[#F6F7F9]">
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={index}
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
          {table.getRowModel().rows.map((row, index) => (
            <TableRow key={index} className="border-b">
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={index}
                  className="py-7 text-center text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={table.getHeaderGroups()[0].headers.length}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center justify-end gap-2">
                  {pages.length > 0 && (
                    <p className="text-xs font-semibold text-black/50">
                      Showing{" "}
                      {table.getFilteredRowModel().rows.length > 0
                        ? pagination.pageIndex * pagination.pageSize + 1
                        : 0}{" "}
                      -{" "}
                      {pagination.pageIndex * pagination.pageSize +
                        table.getRowModel().rows.length}{" "}
                      of {table.getFilteredRowModel().rows.length} records
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2">
                  {table.getCanPreviousPage() && (
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg border"
                      onClick={() => table.previousPage()}
                    >
                      <ChevronLeft size={16} />
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    {pages.map((num, index) => (
                      <p
                        key={index}
                        onClick={() => table.setPageIndex(num - 1)}
                        className={`${
                          table.getState().pagination.pageIndex + 1 === num
                            ? "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-[#FFC107] text-[13px] font-semibold text-black"
                            : "font-no flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-[13px] text-black"
                        }`}
                      >
                        {num}
                      </p>
                    ))}
                  </div>
                  {table.getCanNextPage() && (
                    <div
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border"
                      onClick={() => table.nextPage()}
                    >
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

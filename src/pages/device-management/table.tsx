import DataTable from "@/components/custom/data-table"
import Pagination from "@/components/custom/pagination"
import SearchInput from "@/components/custom/search-input"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Ban, Edit } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router"

export type Store = {
  id: string
  createdAt: string
  updatedAt: string
  code: string
  name: string
  division: string
  location: string
  cluster: string
  contactPerson: string
  contactNumber: string
  status: string
}

export type StoreData = {
  items: Store[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

const EMPTY_STORE_DATA: StoreData = {
  items: [],
  page: 1,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
}

export default function DeviceManagementTable() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get("page") ?? "1"
  const pageSize = searchParams.get("pageSize") ?? "1"
  const q = searchParams.get("q") ?? ""

  const {
    data = EMPTY_STORE_DATA,
    isLoading,
    error,
  } = useQuery<StoreData>({
    queryKey: ["store-management", page, q, pageSize],
    queryFn: async () => {
      const { data } = await api.get<StoreData>("/store", {
        params: { page, pageSize, q: q || undefined },
      })
      return data
    },
    placeholderData: (prev) => prev,
  })

  const columns = useMemo<ColumnDef<Store>[]>(
    () => [
      { accessorKey: "name", header: "Store Name" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "cluster", header: "Assigned Devices" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status
          const isActive = status == "active"
          return (
            <Badge
              variant={isActive ? "success" : "failed"}
              className="px-3.5 py-1.25 font-semibold capitalize"
            >
              {status}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <div className="flex gap-2">
            <Edit className="size-3.75" />
            <Ban className="size-3.75" />
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-row justify-end">
        <SearchInput />
      </div>
      <DataTable
        data={data.items}
        columns={columns}
        isLoading={isLoading}
        error={error}
      />
      <Pagination
        page={data.page}
        total={data.totalPages}
        pageSize={data.pageSize}
      />
    </div>
  )
}

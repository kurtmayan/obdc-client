import DataTable from "@/components/custom/data-table"
import Pagination from "@/components/custom/pagination"
import SearchInput from "@/components/custom/search-input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { storeManagement } from "@/store/store-management-page"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Ban, Edit } from "lucide-react"
import { useMemo } from "react"
import { useSearchParams } from "react-router"
import type { StoreInformation } from "./store-sheet"
import CollapsibleContainer from "@/components/custom/colapsible-container"

export type StoreData = {
  items: StoreInformation[]
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

export default function StoreManagementTable() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get("page") ?? "1"
  const pageSize = searchParams.get("pageSize") ?? "10"
  const q = searchParams.get("q") ?? ""
  const { setStoreToEdit, setOpenSheet } = storeManagement()
  const { setSelectedIdToDelete, setOpenDelete } = storeManagement()

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
      console.log(data)
      return data
    },
    placeholderData: (prev) => prev,
  })

  const columns = useMemo<ColumnDef<StoreInformation>[]>(
    () => [
      { accessorKey: "name", header: "Store Name" },
      { accessorKey: "location", header: "Location" },
      {
        accessorKey: "devices",
        header: "Assigned Devices",
        cell: ({ row }) => (
          <CollapsibleContainer items={row.original.devices} />
        ),
      },
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
        cell: ({ row }) => (
          <div className="flex justify-center gap-3">
            <Edit
              className="size-4"
              onClick={() => {
                setStoreToEdit(row.original.id)
                setOpenSheet(true)
                console.log("asds")
              }}
            />
            <Ban
              className="size-4"
              onClick={() => {
                setSelectedIdToDelete(row.original.id)
                setOpenDelete(true)
              }}
            />
          </div>
        ),
      },
    ],
    [setStoreToEdit, setOpenSheet, setSelectedIdToDelete, setOpenDelete]
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

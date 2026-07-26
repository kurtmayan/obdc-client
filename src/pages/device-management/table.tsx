import DataTable from "@/components/custom/data-table"
import Pagination from "@/components/custom/pagination"
import SearchInput from "@/components/custom/search-input"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { deviceManagement } from "@/store/device-management-page"
import type { Device } from "@/types/device"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { useMemo } from "react"
import { useSearchParams } from "react-router"

export type DeviceData = {
  items: Device[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

const EMPTY_DEVICE_DATA: DeviceData = {
  items: [],
  page: 1,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
}

function getDeviceStoreName(device: Device) {
  const store = device.store ?? device.stores

  if (!store) {
    return "No store connected"
  }

  return store.location ? `${store.name} - ${store.location}` : store.name
}

export default function DeviceManagementTable() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get("page") ?? "1"
  const pageSize = searchParams.get("pageSize") ?? "10"
  const q = searchParams.get("q") ?? ""
  const { setDeviceToEdit, setOpenSheet } = deviceManagement()
  const { setSelectedIdToDelete, setOpenDelete } = deviceManagement()

  const {
    data = EMPTY_DEVICE_DATA,
    isLoading,
    error,
  } = useQuery<DeviceData>({
    queryKey: ["device-management", page, q, pageSize],
    queryFn: async () => {
      const { data } = await api.get<DeviceData>("/device", {
        params: { page, pageSize, q: q || undefined },
      })
      return data
    },
    placeholderData: (prev) => prev,
  })

  const columns = useMemo<ColumnDef<Device>[]>(
    () => [
      { accessorKey: "serialNumber", header: "Serial Number" },
      { accessorKey: "model", header: "Model" },
      {
        id: "store",
        header: "Connected Store",
        cell: ({ row }) => getDeviceStoreName(row.original),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-center gap-3">
            <Edit
              className="size-4 cursor-pointer"
              onClick={() => {
                setDeviceToEdit(row.original.id)
                setOpenSheet(true)
              }}
            />
            <Trash2
              className="size-4 cursor-pointer"
              onClick={() => {
                setSelectedIdToDelete(row.original.id)
                setOpenDelete(true)
              }}
            />
          </div>
        ),
      },
    ],
    [setDeviceToEdit, setOpenSheet, setSelectedIdToDelete, setOpenDelete]
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

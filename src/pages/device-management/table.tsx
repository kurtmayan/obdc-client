import DataTable from "@/components/custom/data-table"
import Pagination from "@/components/custom/pagination"
import SearchInput from "@/components/custom/search-input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { deviceManagement } from "@/store/device-management-page"
import type { Device } from "@/types/device"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Ban, Edit } from "lucide-react"
import { useMemo } from "react"
import { useSearchParams } from "react-router"
import type { Permissions } from "@/types/permission"

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

  const { data: permission } = useQuery<Permissions>({
    queryKey: ["permission"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/permission`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      return data
    },
  })

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
            <Button
              variant={"ghost"}
              disabled={!permission?.deviceManagement.canUpdate}
              onClick={() => {
                setDeviceToEdit(row.original.id)
                setOpenSheet(true)
              }}
              className="cursor-pointer"
            >
              <Edit className="size-4 cursor-pointer text-[#FFC107]" />
            </Button>
            <Button
              variant={"ghost"}
              disabled={!permission?.deviceManagement.canDelete}
              onClick={() => {
                setSelectedIdToDelete(row.original.id)
                setOpenDelete(true)
              }}
              className="cursor-pointer"
            >
              <Ban className={"size-4 text-[#FFC107]"} />
            </Button>
          </div>
        ),
      },
    ],
    [
      setDeviceToEdit,
      setOpenSheet,
      setSelectedIdToDelete,
      setOpenDelete,
      permission,
    ]
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

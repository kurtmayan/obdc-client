import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { api } from "@/lib/api"
import type { Store } from "@/types/sync.type"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import StoreViewTable from "./table"

export type SyncLog = {
  id: string
  logDate: Date | string
  lastSync: Date | string
  status: string
  pending: number
  totalRecord: number
}

export default function SyncMonitorStoreView() {
  const navigate = useNavigate()
  const { storeId } = useParams<{ storeId: string }>()

  const {
    data: storeData,
    isLoading,
    isError,
  } = useQuery<Store>({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const { data } = await api.get<Store>(`/store/${storeId}`)
      return data
    },
    enabled: !!storeId,
  })

  if (isLoading) return <p>Loading....</p>
  if (isError || !storeData) return <p>Error loading store data</p>

  const deviceModel = storeData.devices[0]?.model

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white px-6 py-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-sm font-medium text-black/50"
                onClick={() => navigate(-1)}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-black">
                {storeData.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="bg-white px-6 py-5">
        <h2 className="text-2xl font-medium">{storeData.name}</h2>
        <p className="text-xs font-normal text-[#8A96A3]">
          Location: {storeData.location}
        </p>
        <div className="mt-4 flex gap-5">
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">
              Device Model
            </p>
            <p className="text-sm font-normal">
              {deviceModel ?? "No device connected"}
            </p>
          </div>
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">Status</p>

            {deviceModel ? (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <p className="text-sm font-normal">Synced</p>
              </div>
            ) : (
              <p className="text-sm">Not Synced</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white px-6 py-5">
        <StoreViewTable storeId={storeId!} />
      </div>
    </div>
  )
}
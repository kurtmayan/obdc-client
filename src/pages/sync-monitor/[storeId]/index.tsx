import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import type { Store } from "@/types/sync.type"
import StoreViewTable from "./table"

export type SyncLog = {
  id: string
  logDate: Date
  lastSync: Date
  status: string
  pending: number
  totalRecord: number
}

export default function SyncMonitorStoreView() {
  const navigate = useNavigate()
  const { storeId } = useParams<{ storeId: string }>()

  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useQuery<Store[]>({
    queryKey: ["attendance"],
    queryFn: async () => {
      const data = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      return await data.json()
    },
  })

  const {
    data: dataSyncLog,
    isLoading: logsLoading,
    isError: logsError,
  } = useQuery<SyncLog[]>({
    queryKey: ["attendance-store", storeId],
    queryFn: async () => {
      const data = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store/${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      return await data.json()
    },
    enabled: !!storeId,
  })

  const storeDataFiltered = storeData?.find((store) => store.id === storeId)

  const isLoading = storeLoading || logsLoading
  const isError = storeError || logsError

  if (isLoading) return <p>Loading....</p>
  if (isError || !storeData || !dataSyncLog)
    return <p>Error loading store data</p>

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
                {storeDataFiltered?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="bg-white px-6 py-5">
        <h2 className="text-2xl font-medium">{storeDataFiltered?.name}</h2>
        <p className="text-xs font-normal text-[#8A96A3]">
          Location: {storeDataFiltered?.location}
        </p>
        <div className="mt-4 flex gap-5">
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">
              Device Model
            </p>
            <p className="text-sm font-normal">
              {storeDataFiltered?.devices[0]?.model ? (
                storeDataFiltered.devices[0].model
              ) : (
                <p className="text-sm">No device Connected</p>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">Status</p>

            {storeDataFiltered?.devices[0]?.model ? (
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

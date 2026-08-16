import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import SearchIcon from "@/components/icons/search-icon"
import { useNavigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import type { SyncLog } from ".."
import type { Store } from "@/types/sync.type"
import DetailedViewTable, { type StoreSyncRecordWithAttendance } from "./table"
import { useTableSearch } from "@/store/useTableSearch"
import { useEffect } from "react"
import { api } from "@/lib/api"
import Loading from "@/pages/loading"

export default function SyncMonitorDetailedView() {
  const { setQuery } = useTableSearch()
  const navigate = useNavigate()
  const { storeId, detailedId } = useParams<{
    storeId: string
    detailedId: string
  }>()

  const {
    data: store,
    isLoading: storeLoading,
    isError: storeError,
  } = useQuery<Store>({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const { data } = await api.get<Store>(`/store/${storeId}`)
      return data
    },
    enabled: !!storeId,
  })

  const {
    data: syncLogData,
    isLoading: syncLoading,
    isError: syncError,
  } = useQuery<SyncLog[]>({
    queryKey: ["sync-logs", storeId],
    queryFn: async () => {
      const { data } = await api.get<SyncLog[]>(`/attendance/store/${storeId}`)
      return data
    },
    enabled: !!storeId,
  })

  const {
    data: attendanceData,
    isLoading: detailLoading,
    isError: detailError,
  } = useQuery<StoreSyncRecordWithAttendance>({
    queryKey: ["attendance", storeId, detailedId],
    queryFn: async () => {
      const { data } = await api.get<StoreSyncRecordWithAttendance>(
        `/attendance/store/${storeId}/${detailedId}`
      )
      return data
    },
    enabled: !!storeId && !!detailedId,
  })

  const syncLog = syncLogData?.find((log) => log.id === detailedId)

  useEffect(() => {
    setQuery("")
  }, [setQuery])

  const isLoading = storeLoading || syncLoading || detailLoading
  const isError = storeError || syncError || detailError

  if (isLoading) return <Loading />
  if (isError || !store || !syncLog || !attendanceData)
    return <p>Error loading data</p>

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white px-6 py-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-sm font-medium text-black/50">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage
                className="cursor-pointer text-sm font-medium text-black/50"
                onClick={() => navigate(-1)}
              >
                {store.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-black">
                Logs for {format(new Date(syncLog.logDate), "MMMM d, yyyy")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="bg-white px-6 py-5">
        <h2 className="text-2xl font-medium">{store.name}</h2>
        <p className="text-xs font-normal text-[#8A96A3]">
          Location: {store.location}
        </p>
        <div className="mt-4 flex gap-5">
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">
              Device Model
            </p>
            <p className="text-sm font-normal">
              {store.devices?.[0]?.model || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">Status</p>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-normal">Synced</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-nowrap text-[#1F1F1F]">
              Logs for {format(new Date(syncLog.logDate), "MMMM d, yyyy")}
            </h1>
            <Badge className="bg-[#D4FDE7] text-[#00662D]">
              {attendanceData.attendanceRecord.length} /{" "}
              {attendanceData.attendanceRecord.length} Synced
            </Badge>
          </div>
          <Field className="my-5 w-55.75">
            <InputGroup>
              <InputGroupInput
                placeholder="Search employee name"
                onChange={(e) => setQuery(e.target.value)}
                className="text-sm placeholder:text-xs placeholder:text-[#00000080]"
              />
              <InputGroupAddon align={"inline-start"}>
                <SearchIcon fill="#00000033" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <DetailedViewTable storeId={storeId!} detailedId={detailedId!} />
      </div>
    </div>
  )
}

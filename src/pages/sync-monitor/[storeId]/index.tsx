import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import EyeIcon from "@/components/icons/eye-icon"
import { formatDate } from "date-fns"
import { useNavigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { capitalize } from "@/lib/capitalize"
import type { Store } from "@/types/sync.type"

export type SyncLog = {
  id: string
  logDate: Date
  lastSync: Date
  status: string
  pending: number
  totalRecord: number
}

const tableHeader = [
  "log date",
  "total record",
  "synced",
  "pending",
  "last sync",
  "status",
  "action",
]

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
        `${import.meta.env.VITE_SERVER_URL}/attendance/store`
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
        `${import.meta.env.VITE_SERVER_URL}/attendance/store/${storeId}`
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
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F6F7F9]">
              {tableHeader.map((header) => (
                <TableHead
                  className="text-center text-xs font-semibold tracking-[0.5px] text-navy-blue uppercase first:text-left"
                  key={header}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSyncLog?.map(
              (
                { id, logDate, totalRecord, pending, lastSync, status },
                index
              ) => {
                return (
                  <TableRow key={index} className="h-16">
                    <TableCell className="items-center gap-2">
                      <p className="text-xs font-semibold text-navy-blue">
                        {formatDate(logDate, "MMMM d, yyyy")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <p className="text-xs font-medium text-navy-blue">
                          {totalRecord}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-xs font-medium text-navy-blue">
                            {totalRecord}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-xs font-medium text-navy-blue">
                            {pending}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-xs font-medium text-navy-blue">
                            {formatDate(lastSync, "MMMM d, yyyy, h:mm:ss a")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <Badge
                            className={`flex items-center gap-1 bg-green-400 text-white`}
                          >
                            {capitalize(status)}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <Button
                            variant={"outline"}
                            onClick={() =>
                              navigate(`/sync-monitor/${storeId}/${id}`)
                            }
                          >
                            <EyeIcon />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

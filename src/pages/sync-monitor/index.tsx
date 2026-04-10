import SyncIcon from "@/components/icons/sync-icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { capitalize } from "@/lib/capitalize"
import Filter from "./filter"
import { Outlet, useParams, useNavigate } from "react-router"
import { format, formatDistanceToNow } from "date-fns"
import { useQuery } from "@tanstack/react-query"

type StoreSyncRecord = {
  id: string
  syncDate: Date
  storesId: string
}

type Device = {
  id: string
  model: string
  serialNumber: string
  storesId: string
  createdAt: Date
  updatedAt: Date
}

export type Store = {
  id: string
  code: string
  name: string
  region: string
  province: string
  municipality: string
  barangay: string
  exactAddress: string
  createdAt: Date
  updatedAt: Date
  contactInfo: string | null
  storeSyncRecords: StoreSyncRecord[]
  devices: Device[]
}

const tableHeader = ["location", "region", "last sync", "status", "action"]

export default function SyncMonitor() {
  const navigate = useNavigate()
  const { storeId } = useParams<{ storeId?: string }>()

  const { data: dataStores = [], isLoading } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/attendance/store`
      )
      return res.json()
    },
  })

  if (storeId) {
    return <Outlet />
  }

  // if (isLoading) return <p>Loading....</p>
  // if (isError || !dataStores) return <p>Error loading stores</p>

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <p className="text- text-2xl font-bold">Sync Monitor Overview</p>
          <p className="text-sm text-[#8A96A3]">
            Summary of biometric data synchronization
          </p>
        </div>
      </div>

      <div className="bg-white px-6 py-5">
        <Filter />
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
            {isLoading && (
              <TableCell
                colSpan={tableHeader.length}
                className="py-10 text-center text-sm text-gray-500"
              >
                Loading...
              </TableCell>
            )}
            {dataStores?.map(
              ({ id, name, region, storeSyncRecords, devices }, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="items-center gap-2">
                      <p className="text-sm font-semibold text-navy-blue">
                        {name}
                      </p>
                      <p className="text-xs font-normal text-[#8A96A3]">
                        {devices[0].model} - {devices[0].serialNumber}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <p className="text-sm font-medium text-navy-blue">
                          {region}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <p className="text-sm font-medium text-navy-blue">
                            {storeSyncRecords.length != 0 &&
                              format(
                                new Date(storeSyncRecords[0]?.syncDate),
                                "MMMM d, h:mm a"
                              )}
                          </p>
                          <p className="text-xs font-normal text-[#8A96A3]">
                            {storeSyncRecords.length != 0 &&
                              formatDistanceToNow(
                                new Date(storeSyncRecords[0]?.syncDate),
                                {
                                  addSuffix: true,
                                }
                              )}
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
                            {capitalize("synced")}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div className="flex flex-row">
                          <div>
                            <Button variant={"outline"}>
                              <SyncIcon height={6} width={6} />
                              Retry
                            </Button>
                          </div>
                          <Button
                            variant={"outline"}
                            onClick={() => navigate(`/sync-monitor/${id}`)}
                          >
                            View
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

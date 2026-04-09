import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import SearchIcon from "@/components/icons/search-icon"
import InviteUser from "./invite-user"

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

const tableHeader = [
  "name",
  "email address",
  "contact numner",
  "status",
  "actions",
]

export default function UserManagement() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <p className="text- text-2xl font-bold">User Management</p>
          <p className="text-sm text-[#8A96A3]">
            Manage system users and control access permissions.
          </p>
        </div>
        <InviteUser />
      </div>

      <div className="bg-white px-6 py-5">
        <Field className="w-55.75">
          <InputGroup>
            <InputGroupInput
              placeholder="Search by name, email..."
              className="text-sm placeholder:text-xs placeholder:text-[#00000080]"
            />
            <InputGroupAddon align={"inline-start"}>
              <SearchIcon fill="#00000033" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
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
            {/* {dataStores?.map(
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
                            {format(
                              storeSyncRecords[0]?.syncDate,
                              "MMMM d, h:mm a"
                            )}
                          </p>
                          <p className="text-xs font-normal text-[#8A96A3]">
                            {formatDistanceToNow(
                              storeSyncRecords[0]?.syncDate,
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
            )} */}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

import {
  Table,
  TableBody,
  TableCell,
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
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dot, SquarePen } from "lucide-react"

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

export interface User {
  id: string
  firstName: string
  middleName: string
  lastName: string
  contactNumber: string | null
  email: string
  role: "SUPERADMIN" | "HR" | "MP"
  status: "ACTIVE" | "PENDING"
}

const tableHeader = [
  "name",
  "email address",
  "contact numner",
  "status",
  "actions",
]

export default function UserManagement() {
  const { data } = useQuery<User[]>({
    queryKey: ["user-management"],
    queryFn: async () => {
      const data = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return await data.json()
    },
  })

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
            {data?.map(
              (
                { firstName, lastName, contactNumber, email, status },
                index
              ) => {
                const statusStyles: Record<
                  User["status"],
                  { bg: string; text: string }
                > = {
                  ACTIVE: { bg: "bg-[#10B9811A]", text: "text-[#059669]" },
                  PENDING: { bg: "bg-[#F59E0B1A]", text: "text-[#D97706]" },
                }
                return (
                  <TableRow key={index}>
                    <TableCell className="items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="#" />
                          <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold text-navy-blue">
                          {firstName + " " + lastName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <p className="text-sm font-medium text-[#8A96A3]">
                          {email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <p className="text-sm font-medium text-navy-blue">
                          {contactNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <div>
                          <Badge
                            className={`${statusStyles[status].bg} text-xs font-semibold ${statusStyles[status].text} flex items-center gap-1`}
                          >
                            <Dot size={12} strokeWidth={3} />
                            {status}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid place-items-center">
                        <Button variant={"link"}>
                          <SquarePen size={16} />
                        </Button>
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

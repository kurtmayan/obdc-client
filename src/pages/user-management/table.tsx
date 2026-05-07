import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dot, SquarePen } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import TableData from "@/components/custom/table"
import { Badge } from "@/components/ui/badge"

export type User = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  contactNumber: string | null
  email: string
  role: "SUPERADMIN" | "HR" | "MP"
  status: "ACTIVE" | "PENDING"
}

const formatPhoneNumber = (phone: string | null): string => {
  if (!phone?.trim()) return "N/A"
  const digits = phone.replace(/\D/g, "")
  const cleanedDigits = digits.startsWith("0") ? digits.slice(1) : digits
  if (cleanedDigits.length !== 10) return phone
  return `+63 ${cleanedDigits.slice(0, 3)} ${cleanedDigits.slice(3, 6)} ${cleanedDigits.slice(6)}`
}

export default function UserManagementTable() {
  const { data } = useQuery<User[]>({
    queryKey: ["user-management"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return res.json()
    },
  })

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Name",
        cell: ({ row }) => (
          <p className="text-left text-sm font-semibold text-navy-blue">
            {`${row.original.firstName} ${row.original.lastName}`}
          </p>
        ),
      },
      {
        accessorKey: "email",
        header: "Email address",
        cell: ({ row }) => (
          <p className="text-xs font-normal text-[#8A96A3]">
            {row.original.email}
          </p>
        ),
      },
      {
        accessorKey: "contactNumber",
        header: "Contact Number",
        cell: ({ row }) => (
          <p className="text-sm font-normal text-navy-blue">
            {formatPhoneNumber(row.original.contactNumber)}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const STATUS_STYLES: Record<User["status"], string> = {
            ACTIVE: "bg-[#10B9811A] text-[#059669]",
            PENDING: "bg-[#F59E0B1A] text-[#D97706]",
          }
          return (
            <Badge
              className={`text-xs font-semibold ${STATUS_STYLES[row.original.status]}`}
            >
              <Dot size={144} strokeWidth={3} />
              {row.original.status}
            </Badge>
          )
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: () => (
          <div className="grid place-items-center">
            <Button variant={"link"}>
              <SquarePen size={16} />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return <TableData columns={columns} data={data ?? []} />
}

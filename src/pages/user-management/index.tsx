import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import SearchIcon from "@/components/icons/search-icon"
import InviteUser from "./invite-user"
import UserManagementTable from "./table"
import { useTableSearch } from "@/store/useTableSearch"
import { useLocation } from "react-router"
import { useEffect } from "react"

export default function UserManagement() {
  const { setQuery } = useTableSearch()
  const location = useLocation()

  useEffect(() => {
    setQuery("")
  }, [location.pathname, setQuery])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <p className="text- text-2xl font-bold">User Management Overview</p>
          <p className="text-sm text-[#8A96A3]">
            Manage system users and control access permissions.
          </p>
        </div>
        <InviteUser />
      </div>

      <div className="border bg-white px-6 py-5">
        <Field className="mb-10 flex w-55.75 items-center justify-center">
          <InputGroup>
            <InputGroupInput
              placeholder="Search by name, email..."
              className="text-sm placeholder:text-xs placeholder:text-[#00000080]"
              onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroupAddon align={"inline-start"}>
              <SearchIcon fill="#00000033" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <UserManagementTable />
      </div>
    </div>
  )
}

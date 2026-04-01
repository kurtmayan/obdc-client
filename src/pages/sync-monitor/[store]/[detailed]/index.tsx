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
import { Badge } from "@/components/ui/badge"
import { formatDate } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import ExportIcon from "@/components/icons/export-icon"
import SearchIcon from "@/components/icons/search-icon"

const dummyHeader = ["employee", "mode", "date"]

const dummyData = [
  {
    employeeName: "John Doe",
    mode: "Time In",
    date: new Date("2026-04-01T08:00:00Z"),
  },
  {
    employeeName: "John Doe",
    mode: "Time Out",
    date: new Date("2026-04-01T17:00:00Z"),
  },
  {
    employeeName: "Jane Smith",
    mode: "Time In",
    date: new Date("2026-04-01T08:15:00Z"),
  },
  {
    employeeName: "Jane Smith",
    mode: "Time Out",
    date: new Date("2026-04-01T17:05:00Z"),
  },
  {
    employeeName: "Michael Lee",
    mode: "Time In",
    date: new Date("2026-04-01T08:05:00Z"),
  },
  {
    employeeName: "Michael Lee",
    mode: "Time Out",
    date: new Date("2026-04-01T17:10:00Z"),
  },
  {
    employeeName: "Emily Davis",
    mode: "Time In",
    date: new Date("2026-04-01T08:10:00Z"),
  },
  {
    employeeName: "Emily Davis",
    mode: "Time Out",
    date: new Date("2026-04-01T17:15:00Z"),
  },
  {
    employeeName: "David Wilson",
    mode: "Time In",
    date: new Date("2026-04-01T08:20:00Z"),
  },
  {
    employeeName: "David Wilson",
    mode: "Time Out",
    date: new Date("2026-04-01T17:25:00Z"),
  },
  {
    employeeName: "Sophia Brown",
    mode: "Time In",
    date: new Date("2026-04-01T08:30:00Z"),
  },
  {
    employeeName: "Sophia Brown",
    mode: "Time Out",
    date: new Date("2026-04-01T17:35:00Z"),
  },
  {
    employeeName: "Chris Johnson",
    mode: "Time In",
    date: new Date("2026-04-01T08:40:00Z"),
  },
  {
    employeeName: "Chris Johnson",
    mode: "Time Out",
    date: new Date("2026-04-01T17:45:00Z"),
  },
  {
    employeeName: "Olivia Martinez",
    mode: "Time In",
    date: new Date("2026-04-01T08:50:00Z"),
  },
  {
    employeeName: "Olivia Martinez",
    mode: "Time Out",
    date: new Date("2026-04-01T17:55:00Z"),
  },
  {
    employeeName: "Ethan Anderson",
    mode: "Time In",
    date: new Date("2026-04-01T08:55:00Z"),
  },
  {
    employeeName: "Ethan Anderson",
    mode: "Time Out",
    date: new Date("2026-04-01T18:00:00Z"),
  },
]

export default function SyncMonitorDetailedView() {
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
              <BreadcrumbPage className="text-sm font-medium text-black/50">
                Store #004 Malolos Bayan
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-black">
                Logs for March 10, 2026
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="bg-white px-6 py-5">
        <h2 className="text-2xl font-medium">Store #004 Malolos Bayan</h2>
        <p className="text-xs font-normal text-[#8A96A3]">ID: DIY-MLS-001</p>
        <div className="mt-4 flex gap-5">
          <div>
            <p className="text-xs font-normal text-[#1F1F1F80]/50">
              Device Model
            </p>
            <p className="text-sm font-normal">ZKTeco F18</p>
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
              Logs for March 10, 2026
            </h1>
            <Badge className="bg-[#D4FDE7] text-[#00662D]">
              146 / 146 Synced
            </Badge>
          </div>
          <Field className="w-55.75">
            <InputGroup>
              <InputGroupInput
                id="input-group-url"
                placeholder="Search"
                className="text-sm placeholder:text-xs placeholder:text-[#00000080]"
              />
              <InputGroupAddon align={"inline-start"}>
                <SearchIcon fill="#00000033" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow className="bg-[#F6F7F9]">
              {dummyHeader.map((header) => (
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
            {dummyData?.map(({ employeeName, date, mode }, index) => {
              return (
                <TableRow key={index} className="h-16">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-navy-blue">
                          {employeeName}
                        </p>
                        <p className="text-xs font-normal text-[#8A96A3]">
                          EMP-10067
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid place-items-center">
                      <p className="text-sm font-medium text-navy-blue">
                        {mode}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid place-items-center">
                      <div>
                        <p className="text-sm font-medium text-navy-blue">
                          {formatDate(date, "hh:mm a")}
                        </p>
                        <p className="text-xs font-normal text-[#8A96A3]">
                          {formatDate(date, "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

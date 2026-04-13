import OverviewIcon from "@/components/icons/overview-icon"
import SyncIcon from "@/components/icons/sync-icon"
import UsersIcon from "@/components/icons/users-icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Link, Outlet, useLocation, useNavigate } from "react-router"

export default function AppLayout() {
  const navLinks = [
    { label: "Dashboard", url: "/", icon: OverviewIcon },
    { label: "Sync Monitor", url: "/sync-monitor", icon: SyncIcon },
    { label: "User Management", url: "/user-management", icon: UsersIcon },
  ]

  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <div className="flex h-full w-65 flex-col bg-navy-blue">
        <div className="mt-5 flex items-center justify-center gap-2 py-6">
          <img src="/app-logo.svg" className="h-13 w-13" />
          <h1 className="text-[20px] font-semibold text-white">
            Mr. DIY O-BDC
          </h1>
        </div>
        <div className="flex flex-col gap-3 px-3 py-6">
          {navLinks.map(({ url, label, icon }) => {
            const Icon = icon
            const active = pathname == url
            return (
              <Link to={url} key={url}>
                <p
                  className={cn(
                    "flex flex-row items-center gap-1 rounded-[6px] px-4 py-3",
                    active ? "bg-[#FFC000]" : "text-white"
                  )}
                >
                  <Icon stroke={active ? "black" : "white"} />
                  {label}
                </p>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto">
          <Separator />
          <Popover modal>
            <PopoverTrigger>
              <div className="mb-5 flex w-full flex-row items-center gap-3 px-3 py-10">
                <Avatar>
                  <AvatarImage src="/app-logo.svg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[#ffffff]">
                    Juan Dela Cruz
                  </p>
                  <p className="text-xs font-normal text-[#ffffff]/60">Admin</p>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Button
                onClick={() => {
                  localStorage.removeItem("token")
                  navigate("/auth/login")
                }}
              >
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto bg-[#F4F6F8] p-8.5">
        <Outlet />
      </main>
    </div>
  )
}

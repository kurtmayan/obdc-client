import OverviewIcon from "@/components/icons/overview-icon"
import SyncIcon from "@/components/icons/sync-icon"
import UsersIcon from "@/components/icons/users-icon"
import DeviceIcon from "@/components/icons/device-icon"
import type { ValidateTypeResponse } from "@/components/protected-route"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { Store } from "lucide-react"
import { addDays, compareAsc, differenceInDays } from "date-fns"
import { toast } from "sonner"

export default function AppLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { data: authData } = useQuery<ValidateTypeResponse>({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/validate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      console.log(data)
      return data
    },
  })

  const sendPasswordUpdate = useMutation<
    { message: string; token: string },
    unknown,
    { email: string }
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/request-password-reset-token/${authData?.sub}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(credentials),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw data
      }
      return data
    },
    onSuccess: (e, variable) => {
      e.token
      navigate(
        `/auth/update-password?type=expired&token=${encodeURIComponent(e.token)}&email=${variable.email}`
      )
    },
  })

  const isAlreadyExpired = (lastPasswordUpdate?: string | null): boolean => {
    if (!lastPasswordUpdate) return false

    return (
      compareAsc(new Date(), addDays(new Date(lastPasswordUpdate), 90)) >= 0
    )
  }

  const navLinks = [
    { label: "Dashboard", url: "/", icon: OverviewIcon },
    { label: "Sync Monitor", url: "/sync-monitor", icon: SyncIcon },
    { label: "User Management", url: "/user-management", icon: UsersIcon },
    { label: "DTR Upload", url: "/dtr-upload", icon: UsersIcon },
    {
      label: "Store Management",
      url: "/store-management",
      icon: Store,
    },
    {
      label: "Device Management",
      url: "/device-management",
      icon: DeviceIcon,
    },
  ]

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <div className="flex h-full w-65 flex-col bg-navy-blue">
        <div className="mt-5 flex items-center justify-center gap-2 py-6">
          <img src="/app-logo.svg" className="h-13 w-13" />
          <h1 className="text-[20px] font-semibold text-white">
            Biometric Consolidator
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
                    {authData?.firstName} {authData?.lastName}
                  </p>
                  <p className="text-left text-xs font-normal text-[#ffffff]/60">
                      {authData?.role}
                  </p>
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

      <AlertDialog open={isAlreadyExpired(authData?.lastPasswordUpdate)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Expiration Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Your password is about to expire. To keep your account secure and
              avoid being locked out, please update your password now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                if (!authData?.email) {
                  return toast.error("Email not found. Please contact support.")
                }
                sendPasswordUpdate.mutate({ email: authData.email })
              }}
            >
              Update Password
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

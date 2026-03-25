import OverviewIcon from "@/components/icons/overview-icon"
import SyncIcon from "@/components/icons/sync-icon"
import { cn } from "@/lib/utils"
import { Link, Outlet, useLocation } from "@tanstack/react-router"

export default function AppLayout() {
  const navLinks = [
    { label: "Overview", url: "/", icon: OverviewIcon },
    { label: "Sync Monitor", url: "/sync-monitor", icon: SyncIcon },
  ]

  const { pathname } = useLocation()

  return (
    <div className="flex h-256 max-h-256 w-360 max-w-360 flex-row">
      <div className="w-65 bg-navy-blue">
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
      </div>
      <main className="w-full bg-[#F4F6F8] p-8.5">
        <Outlet />
      </main>
    </div>
  )
}

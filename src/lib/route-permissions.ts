import type { Permissions } from "@/types/permission"

export const MANUAL_DTR_UPLOAD_PATH = "/manual-dtr-upload"

export type AppNavLink = {
  label: string
  url: string
  permission: (permissions: Permissions) => boolean
}

export const appNavLinks: AppNavLink[] = [
  {
    label: "Dashboard",
    url: "/",
    permission: (permissions) => permissions.dashboard.canRead,
  },
  {
    label: "Sync Monitor",
    url: "/sync-monitor",
    permission: (permissions) => permissions.syncMonitor.canReadSync,
  },
  {
    label: "User Management",
    url: "/user-management",
    permission: (permissions) => permissions.userManagement.canRead,
  },
  {
    label: "DTR Upload",
    url: "/dtr-upload",
    permission: (permissions) => permissions.dtr.canUploadDtr,
  },
  {
    label: "Store Management",
    url: "/store-management",
    permission: (permissions) => permissions.storeManagement.canRead,
  },
  {
    label: "Device Management",
    url: "/device-management",
    permission: (permissions) => permissions.deviceManagement.canRead,
  },
]

function normalizePath(pathname: string) {
  const path = pathname.replace(/\/+$/, "")
  return path || "/"
}

export function getRoutePermission(pathname: string) {
  const path = normalizePath(pathname)

  if (path === MANUAL_DTR_UPLOAD_PATH) {
    return (permissions: Permissions) => permissions.dtr.canUploadDtr
  }

  if (path === "/sync-monitor" || path.startsWith("/sync-monitor/")) {
    return (permissions: Permissions) => permissions.syncMonitor.canReadSync
  }

  return appNavLinks.find((link) => link.url === path)?.permission
}

export function canAccessPath(pathname: string, permissions: Permissions) {
  const permission = getRoutePermission(pathname)
  return permission ? permission(permissions) : true
}

export function getFirstAllowedPath(permissions: Permissions) {
  return appNavLinks.find((link) => link.permission(permissions))?.url ?? "/forbidden"
}

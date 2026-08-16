import { useAuthQuery, usePermissionQuery } from "@/lib/auth"
import {
  MANUAL_DTR_UPLOAD_PATH,
  canAccessPath,
  getFirstAllowedPath,
} from "@/lib/route-permissions"
import Loading from "@/pages/loading"
export type { ValidateTypeResponse } from "@/types/auth"
import { Navigate, Outlet, useLocation } from "react-router"

export default function ProtectedRoute() {
  const location = useLocation()
  const authQuery = useAuthQuery()
  const permissionQuery = usePermissionQuery({ enabled: !!authQuery.data?.sub })

  if (authQuery.isLoading || permissionQuery.isLoading) {
    return <Loading />
  }

  if (authQuery.isError || !authQuery.data?.sub) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (permissionQuery.isError || !permissionQuery.data) {
    return <Navigate to="/forbidden" replace />
  }

  const currentPath = location.pathname.replace(/\/$/, "")
  const isManualDtrUploadPage = currentPath === MANUAL_DTR_UPLOAD_PATH
  const isMP = authQuery.data.role === "MP"

  if (isMP && !isManualDtrUploadPage) {
    return <Navigate to={MANUAL_DTR_UPLOAD_PATH} replace />
  }

  if (!isMP && isManualDtrUploadPage) {
    return <Navigate to={getFirstAllowedPath(permissionQuery.data)} replace />
  }

  if (!canAccessPath(location.pathname, permissionQuery.data)) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

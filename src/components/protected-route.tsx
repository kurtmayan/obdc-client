import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router"

const MANUAL_DTR_UPLOAD_PATH = "/manual-dtr-upload"

export type ValidateTypeResponse = {
  sub: string
  email: string
  role: "SUPERADMIN" | "HR" | "MP"
  firstName: string
  lastName: string
  middleName: string
  iat: number
  exp: number
}

export default function ProtectedRoute() {
  const location = useLocation()
  const { data, isLoading, isError } = useQuery<ValidateTypeResponse>({
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
      return data
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data?.sub) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  const currentPath = location.pathname.replace(/\/$/, "")
  const isManualDtrUploadPage = currentPath === MANUAL_DTR_UPLOAD_PATH
  const isMP = data.role === "MP"

  if (isMP && !isManualDtrUploadPage) {
    return <Navigate to={MANUAL_DTR_UPLOAD_PATH} replace />
  }

  if (!isMP && isManualDtrUploadPage) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

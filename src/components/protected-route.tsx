import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router"

type ValidateTypeResponse = {
  sub: string
  email: string
  role: string
  firstName: string
  lastName: string
  middleName: string
  iat: number
  exp: number
}

export default function ProtectedRoute() {
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
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data?.sub) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

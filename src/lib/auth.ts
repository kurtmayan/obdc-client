import { queryClient } from "@/queryClient"
import type { ValidateTypeResponse } from "@/types/auth"
import type { Permissions } from "@/types/permission"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

export const authQueryKey = ["auth"] as const
export const permissionQueryKey = ["permission"] as const

const authQueryOptions = {
  staleTime: 0,
  retry: false,
  refetchOnMount: "always" as const,
}

export async function fetchAuth(): Promise<ValidateTypeResponse> {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  const data = await res.json()
  if (!res.ok) {
    throw data
  }
  return data
}

export async function fetchPermissions(): Promise<Permissions> {
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/auth/me/permission`,
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
}

export function useAuthQuery(options?: { enabled?: boolean }) {
  return useQuery<ValidateTypeResponse>({
    queryKey: authQueryKey,
    queryFn: fetchAuth,
    ...authQueryOptions,
    enabled: options?.enabled,
  })
}

export function usePermissionQuery(options?: { enabled?: boolean }) {
  return useQuery<Permissions>({
    queryKey: permissionQueryKey,
    queryFn: fetchPermissions,
    ...authQueryOptions,
    enabled: options?.enabled,
  })
}

export function clearSessionCache() {
  queryClient.clear()
}

export function useLogout() {
  const navigate = useNavigate()
  const activeQueryClient = useQueryClient()

  return () => {
    activeQueryClient.cancelQueries()
    localStorage.removeItem("token")
    activeQueryClient.clear()
    navigate("/auth/login", { replace: true })
  }
}

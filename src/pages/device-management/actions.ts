import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { CreateDeviceInfo, DeviceInformation } from "./device-sheet"

export function useCreateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDeviceInfo) => {
      const { data: res } = await api.post<DeviceInformation>("/device", data)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-management"] })
    },
  })
}

export function useDeactivateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/device/deactivate/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-management"] })
      queryClient.invalidateQueries({ queryKey: ["device-detail-information"] })
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { CreateStoreInfo, StoreInformation } from "./store-sheet"

export function useDeactivateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/store/deactivate/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-management"] })
      queryClient.invalidateQueries({ queryKey: ["store-detail-information"] })
    },
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateStoreInfo) => {
      const { data: res } = await api.post<StoreInformation>("/store", data)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-management"] })
    },
  })
}

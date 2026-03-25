import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (data stays fresh)
      gcTime: 1000 * 60 * 30, // cache stays for 30 minutes
      retry: 2, // retry failed requests twice
      refetchOnWindowFocus: false, // disable auto refetch on tab focus
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

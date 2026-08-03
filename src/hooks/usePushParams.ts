import { useSearchParams } from "react-router"
import { useCallback } from "react"

type QueryValue = string | boolean | null | undefined
type PushParamsOptions = {
  replace?: boolean
  preventScrollReset?: boolean
}

export default function usePushParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  return useCallback(
    (updates: Record<string, QueryValue>, options?: PushParamsOptions) => {
      const params = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key)
        } else if (typeof value === "string") {
          if (value.trim() === "") {
            params.delete(key)
          } else {
            params.set(key, value)
          }
        } else {
          // boolean
          params.set(key, String(value))
        }
      })

      const nextQueryString = params.toString()
      const currentQueryString = searchParams.toString()

      if (nextQueryString === currentQueryString) return

      setSearchParams(params, options)
    },
    [searchParams, setSearchParams]
  )
}

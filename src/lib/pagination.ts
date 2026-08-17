const PAGE_SIZE_OPTIONS = [10, 50] as const

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

export function parsePageParam(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export function parsePageSizeParam(value: string | null): PageSize {
  const pageSize = Number(value)
  return PAGE_SIZE_OPTIONS.includes(pageSize as PageSize)
    ? (pageSize as PageSize)
    : 10
}

export function getPaginationPages(
  current: number,
  totalPages: number,
  windowSize: number = 4
) {
  let start = Math.max(1, current - windowSize + 1)
  const end = Math.min(totalPages, start + windowSize - 1)

  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

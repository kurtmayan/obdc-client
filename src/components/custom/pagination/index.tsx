import { Button } from "@/components/ui/button"
import usePushParams from "@/hooks/usePushParams"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  page: number
  pageSize: number
  total: number
}

export default function Pagination({ page, pageSize, total }: PaginationProps) {
  const pushParams = usePushParams()

  const totalPages = Math.ceil(total / pageSize)

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  const pageInformation = `Showing ${startItem}-${endItem} of ${total} items`

  const pages = getWindowedPages(page, totalPages)

  const onChange = (value: number) => {
    if (value < 1 || value > totalPages || value === page) return

    pushParams({ page: String(value) })
  }

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">{pageInformation}</p>

      {totalPages > 1 && (
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            size="icon-lg"
            variant="outline"
            aria-label="Go to previous page"
            className="disabled:border-neutral-500 disabled:text-neutral-500"
          >
            <ChevronLeft />
          </Button>

          {pages.map((pageNumber) => (
            <Button
              type="button"
              size="icon-lg"
              variant={pageNumber === page ? "default" : "outline"}
              key={pageNumber}
              onClick={() => onChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            size="icon-lg"
            variant="outline"
            aria-label="Go to next page"
            className="disabled:border-neutral-500 disabled:text-neutral-500"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}

function getWindowedPages(current: number, total: number): number[] {
  const windowSize = 5

  if (total <= 0) {
    return []
  }

  if (total <= windowSize) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  let start = current - Math.floor(windowSize / 2)
  let end = start + windowSize - 1

  if (start < 1) {
    start = 1
    end = windowSize
  }

  if (end > total) {
    end = total
    start = total - windowSize + 1
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

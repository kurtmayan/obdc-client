import React from "react"
import { Button } from "@/components/ui/button"
import ExportIcon from "@/components/icons/export-icon"
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, FileSpreadsheet, FileText, Hourglass } from "lucide-react"
import { DatePickerWithRange } from "./date-range"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { Spinner } from "@/components/ui/spinner"
import { useMutation } from "@tanstack/react-query"
import { Progress } from "@/components/ui/progress"

export default function Export() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })
  const [progress, setProgress] = React.useState(0)

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const exportMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams()
      if (date?.from) params.append("startDate", formatLocalDate(date.from))
      if (date?.to) params.append("endDate", formatLocalDate(date.to))
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/sync/export?${params.toString()}`
      )
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "attendance-export.xlsx"
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    },
    onSuccess: () => {
      setProgress(100)
    },
  })

  React.useEffect(() => {
    if (!exportMutation.isPending) return

    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        const newProgress = prev + Math.random() * 20
        return Math.min(newProgress, 90)
      })
    }, 300)

    return () => clearInterval(interval)
  }, [exportMutation.isPending])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-10 w-30.25">
          <ExportIcon height={18} width={18} />
          <p className="text-[14px] font-semibold text-[#5A2E15]">Export</p>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-[18px] font-semibold">
            New Export Run
          </SheetTitle>
          <Separator className="my-5" />
          <div>
            {exportMutation.isPending && (
              <Alert className="bg-[#E9ECEF] p-5">
                <Hourglass />
                <div className="flex items-center justify-between gap-4">
                  <AlertTitle className="text-sm font-semibold text-navy-blue">
                    Exporting File...
                  </AlertTitle>
                  <p className="text-base font-bold text-[#5A2E15]">
                    {Math.round(progress)}%
                  </p>
                </div>
                <Progress value={progress} className="mt-3 h-1.5" />
              </Alert>
            )}
            {!exportMutation.isPending &&
              !exportMutation.isError &&
              !exportMutation.isSuccess && (
                <Alert className="bg-[#EFF6FF]">
                  <CircleAlert color="#1E40AF" />
                  <AlertDescription className="text-[13px] text-[#1E40AF]">
                    Configure your data export. Files are generated in the
                    background.
                  </AlertDescription>
                </Alert>
              )}
            {exportMutation.isError && (
              <Alert className="bg-[#FFC5C5] p-5">
                <AlertTitle className="text-sm font-semibold text-[#A8000F]">
                  Export Failed
                </AlertTitle>
                <AlertDescription className="text-[13px] text-[#A8000F]">
                  Something went wrong while exporting your data. Please try
                  again.
                </AlertDescription>
              </Alert>
            )}

            {exportMutation.isSuccess && (
              <Alert className="bg-[#D5F3D6] p-5">
                <AlertTitle className="text-sm font-semibold text-[#166534]">
                  Export Successful
                </AlertTitle>
                <AlertDescription className="text-[13px] text-[#166534]">
                  Your data has been exported successfully. You can access it in
                  your downloads.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name" className="font-medium">
              Date Range
            </Label>
            <DatePickerWithRange date={date} onChange={setDate} />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold text-slate-700">
              Export Format
            </Label>

            <ToggleGroup
              type="single"
              className="grid w-full grid-cols-2 gap-4"
            >
              <ToggleGroupItem
                value="excel"
                aria-label="Export to Excel"
                className="group flex h-28 flex-col items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white p-4 text-slate-600 transition-colors hover:bg-slate-50 data-[state=on]:border-amber-500 data-[state=on]:bg-amber-50/50"
              >
                <FileSpreadsheet className="h-7 w-7 text-slate-400 transition-colors group-data-[state=on]:text-emerald-700" />
                <span className="text-sm font-medium">Excel (.xlsx)</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="csv"
                aria-label="Export to CSV"
                className="group flex h-28 flex-col items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white p-4 text-slate-600 transition-colors hover:bg-slate-50 data-[state=on]:border-amber-500 data-[state=on]:bg-amber-50/50"
              >
                <FileText className="h-7 w-7 text-slate-400 transition-colors group-data-[state=on]:text-slate-500" />
                <span className="text-sm font-medium">CSV (.csv)</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild className="grow text-sm">
              <Button variant="outline" className="h-10 bg-[#F6F7F9]">
                Cancel
              </Button>
            </SheetClose>
            <Button
              className="h-10 grow text-sm"
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? (
                <Spinner />
              ) : exportMutation.isError ? (
                "Retry"
              ) : (
                "Export"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

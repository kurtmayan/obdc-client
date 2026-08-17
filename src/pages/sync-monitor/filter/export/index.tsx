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
import { StoreMultiSelect } from "./store-multi-select"
import { EmployeeMultiSelect } from "./employee-multi-select"
import type { DateRange } from "react-day-picker"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Spinner } from "@/components/ui/spinner"
import { Progress } from "@/components/ui/progress"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"

export default function Export() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const exportMutation = useMutation({
    mutationFn: async (data: {
      startDate: string
      endDate: string
      format: string
      storeIds: string[]
      employeeIds: string[]
    }) => {
      const params = new URLSearchParams()
      params.append("startDate", data.startDate)
      params.append("endDate", data.endDate)
      params.append("format", data.format)

      if (data.storeIds.length > 0) {
        params.append("storeIds", data.storeIds.join(","))
      }

      if (data.employeeIds.length > 0) {
        params.append("employeeIds", data.employeeIds.join(","))
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/sync/export?${params.toString()}`
      )
      if (!response.ok) {
        throw new Error(await response.text())
      }
      return response.blob()
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `attendance-export.${form.state.values.format}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
      setProgress(100)
    },
    onError: (error) => {
      console.error(error instanceof Error ? error.message : "Export failed")
    },
  })

  const form = useForm({
    defaultValues: {
      dateRange: undefined as DateRange | undefined,
      format: "",
      storeIds: [] as string[],
      employeeIds: [] as string[],
    },
    onSubmit: async ({ value }) => {
      const dateRange = value.dateRange
      const formatLocalDate = (date: Date) => format(date, "yyyy-MM-dd")
      if (dateRange?.from && dateRange?.to && value.format) {
        exportMutation.mutate({
          startDate: formatLocalDate(dateRange.from),
          endDate: formatLocalDate(dateRange.to),
          format: value.format,
          storeIds: value.storeIds,
          employeeIds: value.employeeIds,
        })
      }
    },
  })

  const isDateDisabled = (checkDate: Date): boolean => {
    const dateRange = form.getFieldValue("dateRange")
    if (!dateRange?.from) return false
    const timeDiff = checkDate.getTime() - dateRange.from.getTime()
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
    return daysDiff < 0 || daysDiff > 31
  }

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

  React.useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        form.reset()
        exportMutation.reset()
        setIsOpen(false)
        setProgress(0)
      }, 1000)
    }
  }, [progress, form, exportMutation])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="h-10 w-30.25">
          <ExportIcon height={18} width={18} />
          <p className="text-[14px] font-semibold text-[#5A2E15]">Export</p>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <form
          className="flex h-full flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
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
                    Your data has been exported successfully. You can access it
                    in your downloads.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4 pb-4">
            <div className="grid gap-3">
              <form.Field
                name="dateRange"
                validators={{
                  onChange: ({ value }) => {
                    if (!value?.from || !value?.to) {
                      return "Please select both start and end dates"
                    }
                  },
                }}
                children={(field) => (
                  <>
                    <Label htmlFor="date-range" className="font-medium">
                      Date Range *
                    </Label>
                    <DatePickerWithRange
                      date={field.state.value}
                      onChange={(newDate: DateRange | undefined) =>
                        field.setValue(newDate)
                      }
                      disabled={isDateDisabled}
                    />
                    {field.state.meta.errors &&
                      field.state.meta.errors.length > 0 && (
                        <p className="mt-1 text-sm text-red-500">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                  </>
                )}
              />
            </div>

            <div className="grid gap-3">
              <form.Field
                name="storeIds"
                children={(field) => (
                  <>
                    <Label className="font-medium">Stores</Label>
                    <StoreMultiSelect
                      value={field.state.value}
                      onChange={(storeIds) => {
                        field.setValue(storeIds)
                        form.setFieldValue("employeeIds", [])
                      }}
                      disabled={exportMutation.isPending}
                    />
                  </>
                )}
              />
            </div>

            <div className="grid gap-3">
              <form.Field
                name="employeeIds"
                children={(field) => (
                  <>
                    <Label className="font-medium">Employees</Label>
                    <form.Subscribe
                      selector={(state) => state.values.storeIds}
                    >
                      {(storeIds) => (
                        <EmployeeMultiSelect
                          value={field.state.value}
                          onChange={(employeeIds) => field.setValue(employeeIds)}
                          storeIds={storeIds}
                          disabled={exportMutation.isPending}
                        />
                      )}
                    </form.Subscribe>
                  </>
                )}
              />
            </div>

            <div className="space-y-3">
              <form.Field
                name="format"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Please select an export format"
                    }
                  },
                }}
                children={(field) => (
                  <>
                    <Label className="text-base font-semibold text-slate-700">
                      Export Format *
                    </Label>

                    <ToggleGroup
                      type="single"
                      value={field.state.value || ""}
                      onValueChange={(value: string) => field.setValue(value)}
                      className="grid w-full grid-cols-2 gap-4"
                    >
                      <ToggleGroupItem
                        value="xlsx"
                        aria-label="Export to Excel"
                        className="group flex h-28 flex-col items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white p-4 text-slate-600 transition-colors hover:bg-slate-50 data-[state=on]:border-amber-500 data-[state=on]:bg-amber-50/50"
                      >
                        <FileSpreadsheet className="h-7 w-7 text-slate-400 transition-colors group-data-[state=on]:text-emerald-700" />
                        <span className="text-sm font-medium">
                          Excel (.xlsx)
                        </span>
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
                    {field.state.meta.errors &&
                      field.state.meta.errors.length > 0 && (
                        <p className="mt-2 text-sm text-red-500">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                  </>
                )}
              />
            </div>
          </div>
          <SheetFooter className="mt-auto border-t pt-6">
            <div className="flex w-full gap-2">
              <SheetClose asChild className="grow text-sm">
                <Button variant="outline" className="h-10 bg-[#F6F7F9]">
                  Cancel
                </Button>
              </SheetClose>
              <form.Subscribe
                selector={(state) => [
                  state.values.dateRange,
                  state.values.format,
                ]}
              >
                {([dateRange, format]) => {
                  const date = dateRange as DateRange | undefined
                  return (
                    <Button
                      type="button"
                      className="h-10 grow text-sm"
                      onClick={() => form.handleSubmit()}
                      disabled={
                        exportMutation.isPending ||
                        !date?.from ||
                        !date?.to ||
                        !format
                      }
                    >
                      {exportMutation.isPending ? <Spinner /> : "Export"}
                    </Button>
                  )
                }}
              </form.Subscribe>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

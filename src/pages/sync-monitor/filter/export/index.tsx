import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import ExportIcon from "@/components/icons/export-icon"
import { Input } from "@/components/ui/input"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CircleAlert, FileSpreadsheet, FileText, Search } from "lucide-react"
import { DatePickerWithRange } from "./date-range"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { Spinner } from "@/components/ui/spinner"

export default function Export() {
  const [isExporting, setIsExporting] = useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}` // "2026-04-13"
  }

  const exportData = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()

      if (date?.from) params.append("startDate", formatLocalDate(date.from))
      if (date?.to) params.append("endDate", formatLocalDate(date.to))

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/sync/export?${params.toString()}`
      )

      if (!response.ok) {
        console.error("Error:", await response.text())
        return
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
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // const stores = [
  //   {
  //     id: 1,
  //     name: "Store #104 - Malolos",
  //   },
  //   {
  //     id: 2,
  //     name: "Store #108 - Guiguinto",
  //   },
  //   {
  //     id: 3,
  //     name: "Store #112 - Baliuag",
  //   },
  // ]
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="h-10 w-30.25"
          // onClick={exportData}
        >
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
            <Alert className="bg-[#EFF6FF]">
              <CircleAlert />
              <AlertDescription className="text-[#1E40AF]">
                Configure your data export. Files are generated in the
                background.
              </AlertDescription>
            </Alert>
          </div>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Date Range</Label>
            {/* <Input id="sheet-demo-name" defaultValue="Pedro Duarte" /> */}
            <DatePickerWithRange date={date} onChange={setDate} />
          </div>
          {/* <div>
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Target Locations</h3>
                <Button variant="link" className="text-yellow-500">
                  Select All
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search stores..." className="pl-8" />
              </div>

              <div className="divide-y rounded-md border">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center space-x-3 p-3"
                  >
                    <Checkbox />
                    <label className="text-sm font-medium">{store.name}</label>
                  </div>
                ))}
              </div>

              <p className="text-right text-xs text-muted-foreground">
                3 locations selected
              </p>
            </div>
          </div> */}

          <div className="space-y-3">
            <Label className="text-base font-semibold text-slate-700">
              Export Format
            </Label>

            <ToggleGroup
              type="single"
              // value={exportFormat}
              // onValueChange={(value) => {
              //   if (value) setExportFormat(value) // Prevents deselecting the active option
              // }}
              className="grid w-full grid-cols-2 gap-4"
            >
              {/* 2a. Excel Option */}
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
              onClick={exportData}
              disabled={isExporting}
            >
              {isExporting ? <Spinner /> : "Export"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

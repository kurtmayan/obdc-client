import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./range-picker"
import Region from "./region"
import Status from "./status"
import ExportIcon from "@/components/icons/export-icon"

export default function Filter() {
  const exportData = async () => {
    try {
      const response = await fetch("http://localhost:3000/sync/export")

      if (!response.ok) {
        console.error("Error:", await response.text())
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "attendance-export.csv"
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Fetch failed:", error)
    }
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DatePickerWithRange />
        <Region />
        <Status />
      </div>
      <Button className="h-10 w-30.25" onClick={exportData}>
        <ExportIcon height={18} width={18} />
        <p className="text-[14px] font-semibold text-[#5A2E15]">Export</p>
      </Button>
    </div>
  )
}

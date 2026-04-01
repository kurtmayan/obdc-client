import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./range-picker"
import Region from "./region"
import Status from "./status"
import ExportIcon from "@/components/icons/export-icon"

export default function Filter() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DatePickerWithRange />
        <Region />
        <Status />
      </div>
      <Button className="h-10 w-30.25">
        <ExportIcon height={18} width={18} />
        <p className="text-[14px] font-semibold text-[#5A2E15]">Export</p>
      </Button>
    </div>
  )
}

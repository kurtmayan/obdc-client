import { DatePickerWithRange } from "./range-picker"
import Region from "./region"
import Status from "./status"

export default function Filter() {
  return (
    <div className="flex items-center gap-4">
      <DatePickerWithRange />
      <Region />
      <Status />
    </div>
  )
}

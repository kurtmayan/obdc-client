import { DatePickerWithRange } from "./range-picker"
import Region from "./region"
import Status from "./status"
import Location from "./location"
import Export from "./export"

export default function Filter() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DatePickerWithRange />
        <Location />
        <Region />
        <Status />
      </div>
      <Export />
    </div>
  )
}

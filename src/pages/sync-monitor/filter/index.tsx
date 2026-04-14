import { DatePickerWithRange } from "./range-picker"
import Division from "./division"
import Cluster from "./cluster"
import Export from "./export"

export default function Filter() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DatePickerWithRange />
        <Cluster />
        <Division />
        {/* <Status /> */}
      </div>
      <Export />
    </div>
  )
}

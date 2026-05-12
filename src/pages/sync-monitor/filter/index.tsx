import { DatePickerWithRange } from "./range-picker"
import Division from "./division"
import Cluster from "./cluster"
import Export from "./export"
import Status from "./status"

export default function Filter() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* TODO: Cluster depends on the selected division */}
        <DatePickerWithRange />
        <Division />
        <Cluster />
        <Status />
      </div>
      <Export />
    </div>
  )
}

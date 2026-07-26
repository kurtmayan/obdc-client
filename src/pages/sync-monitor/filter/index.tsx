import { DatePickerWithRange } from "./range-picker"
import Division from "./division"
import Cluster from "./cluster"
import Export from "./export"
import Status from "./status"

export default function Filter() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {/* TODO: Cluster depends on the selected division */}
        <Division />
        <Cluster />
        <Status />
        <DatePickerWithRange />
      </div>
      <Export />
    </div>
  )
}

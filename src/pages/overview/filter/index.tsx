import Region from "./region"
import Status from "./status"

export default function Filter() {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold">Recent Store Sync Activity</h2>
      <div className="flex gap-4">
        <Region />
        <Status />
      </div>
    </div>
  )
}

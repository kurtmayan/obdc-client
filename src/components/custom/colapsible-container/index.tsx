import type { Device } from "@/types/device"
import { useState } from "react"

export type CollapsibleContainerProps = {
  items: Device[]
}

export default function CollapsibleContainer({
  items,
}: CollapsibleContainerProps) {
  const MINIMUM_CHILDREN = 5

  const [collapsed, setCollapsed] = useState(true)

  const showToggle = items.length > MINIMUM_CHILDREN

  const view = collapsed ? MINIMUM_CHILDREN : items.length

  const handleCollapse = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <div className="flex flex-col text-left">
      <div className="mx-auto grid w-[50%] gap-3">
        {items.slice(0, view).map((item) => (
          <div key={item.id}>
            <p className="text-[14px] text-black">{item.serialNumber}</p>
            <p className="text-xs text-[#8A96A3]">{item.model}</p>
          </div>
        ))}
      </div>

      {showToggle && (
        <button
          type="button"
          className="text-[10px] underline text-shadow-2xs"
          onClick={handleCollapse}
        >
          View {collapsed ? "More" : "Less"}
        </button>
      )}
    </div>
  )
}

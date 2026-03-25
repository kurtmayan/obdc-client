import CorrectIcon from "@/components/icons/correct-icon"
import FailedIcon from "@/components/icons/failed-icon"
import LoadingIcon from "@/components/icons/loading-icon"

export const STATUS_CONFIG = {
  synced: {
    label: "synced",
    className: "bg-[#D4FDE7] text-green-700 text-xs font-semibold",
    icon: CorrectIcon,
  },
  syncing: {
    label: "syncing",
    className: "bg-[#FFF4C2] text-[#9E3900] text-xs",
    icon: LoadingIcon,
  },
  failed: {
    label: "failed",
    className: "bg-[#FFE1E2] text-[#A8000F] text-xs",
    icon: FailedIcon,
  },
} as const

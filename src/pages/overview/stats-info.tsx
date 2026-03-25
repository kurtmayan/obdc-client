type StatsInfoPropType = {
  title: string
  value: string
  description: string
  icon?: React.ReactElement
}

export default function StatsInfo({
  title,
  value,
  description,
  icon,
}: StatsInfoPropType) {
  return (
    <div className="rounded-md bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-[#8A96A3]">{title}</p>
        {icon}
      </div>
      <p className="text-[36px] font-bold">{value}</p>
      <p className="text-[13px] font-normal text-[#8A96A3]">{description}</p>
    </div>
  )
}

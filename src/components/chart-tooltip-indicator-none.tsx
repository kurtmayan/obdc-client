import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query"

const chartConfig = {
  running: {
    label: "Synced",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Pending",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type StatisticsDatasetsType = {
  date: Date
  pending: number
  synced: number
}

export function ChartTooltipIndicatorNone() {
  const { data: dataStatistics = [] } = useQuery<StatisticsDatasetsType[]>({
    queryKey: ["statistics/datasets"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/statistics/datasets`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      return data
    },
  })

  const maxTotal = Math.max(
    0,
    ...(dataStatistics?.map((d) => d.synced + d.pending) ?? [])
  )

  return (
    <Card className="ring-0">
      <CardHeader>
        <CardTitle className="text-[22px] font-semibold text-[#071631]">
          Sync Volume
        </CardTitle>
        <CardDescription className="text-[13.42px] font-normal text-[#656565]">
          Records processed for the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={dataStatistics} barSize={58}>
            <CartesianGrid strokeDasharray="3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
              tick={{
                fill: "#9CA2AD",
                fontSize: 13.42,
                fontWeight: 400,
              }}
            />
            <YAxis
              domain={[0, maxTotal]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              tick={{
                fill: "#9CA2AD",
                fontSize: 13.42,
                fontWeight: 400,
              }}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
              }
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="#E74C3C"
              radius={[0, 0, 8, 8]}
            />
            <Bar
              dataKey="synced"
              stackId="a"
              fill="#5FBE8B"
              radius={[8, 8, 0, 0]}
            />

            <ChartTooltip
              content={<ChartTooltipContent hideIndicator />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

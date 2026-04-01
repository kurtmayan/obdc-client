"use client"

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

const chartData = [
  { date: "2024-07-15", synced: 450, pending: 300 },
  { date: "2024-07-16", synced: 380, pending: 200 },
  { date: "2024-07-17", synced: 520, pending: 120 },
  { date: "2024-07-18", synced: 140, pending: 100 },
  { date: "2024-07-19", synced: 600, pending: 350 },
  { date: "2024-07-20", synced: 480, pending: 400 },
]

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
const maxTotal = Math.max(...chartData.map((d) => d.synced + d.pending))

export function ChartTooltipIndicatorNone() {
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
          <BarChart accessibilityLayer data={chartData} barSize={58}>
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

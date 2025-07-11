"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const LineChartComponent = ({
  chartConfig,
  chartData,
}: {
  chartConfig: ChartConfig;
  chartData: { game: string; score: number }[];
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full h-48 sm:h-64 md:h-96"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          accessibilityLayer
          data={chartData}
          height={100}
          margin={{
            left: 0,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="game"
            tickLine={false}
            axisLine={true}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent hideLabel className="bg-background" />
            }
          />
          <Line
            dataKey="score"
            type="natural"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default LineChartComponent;

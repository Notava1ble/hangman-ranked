"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { CurveType } from "recharts/types/shape/Curve";

const LineChartComponent = ({
  chartConfig,
  chartData,
  lineType,
  className,
}: {
  chartConfig: ChartConfig;
  chartData: unknown[] | undefined;
  lineType?: CurveType;
  className?: string;
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("w-full h-48 md:h-64 lg:h-96", className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          accessibilityLayer
          data={chartData}
          height={100}
          margin={{
            top: 12,
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
          {Object.keys(chartConfig).map((chart, i) => {
            return (
              <Line
                dataKey={chart}
                type={lineType}
                stroke={chartConfig[chart].color}
                strokeWidth={2}
                dot={false}
                key={i}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default LineChartComponent;

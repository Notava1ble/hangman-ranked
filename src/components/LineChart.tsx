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
  DotProps,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { LineDot } from "recharts/types/cartesian/Line";
import { CurveType } from "recharts/types/shape/Curve";
import { ActiveShape, AxisDomain } from "recharts/types/util/types";

const LineChartComponent = ({
  chartConfig,
  chartData,
  lineType,
  className,
  yDomain,
  yPadding,
  dot,
  activeDot,
}: {
  chartConfig: ChartConfig;
  chartData: unknown[] | undefined;
  lineType?: CurveType;
  className?: string;
  yDomain?: AxisDomain;
  yPadding?: {
    top?: number;
    bottom?: number;
  };
  dot?: LineDot;
  activeDot?: ActiveShape<DotProps> | DotProps;
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
            top: 6,
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
          />
          <YAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={yDomain}
            padding={yPadding}
            allowDecimals={false}
          />

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
                dot={dot}
                activeDot={activeDot}
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

"use client";

import { BarChart, XAxis, Bar, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { cn } from "@/lib/utils";

const FrequencyGraph = ({
  chartData,
  chartConfig,
  className,
}: {
  chartData: unknown[];
  chartConfig: ChartConfig;
  className?: string;
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("w-full h-48 md:h-64 lg:h-96", className)}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="letter"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="guessed"
          stackId="a"
          fill="var(--color-guessed)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="appeared"
          stackId="a"
          fill="var(--color-appeared)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default FrequencyGraph;

"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

type valueType = { date: string; count: number };

const CalendarHeatmapComponent = ({ values }: { values: valueType[] }) => {
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);

  const largestCount =
    values.length > 0 ? Math.max(...values.map((v) => v.count)) : 1;
  return (
    <CalendarHeatmap
      startDate={lastYear}
      endDate={today}
      values={values}
      showOutOfRangeDays={true}
      classForValue={(value) => {
        if (!value || value.count === 0) {
          return "color-empty";
        }
        const colorValue =
          Math.ceil(((value.count as number) / largestCount) * 7) * 100;
        return `fill-green-${colorValue}`;
      }}
    />
  );
};
export default CalendarHeatmapComponent;

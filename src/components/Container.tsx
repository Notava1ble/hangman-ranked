"use client";

import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-md drop-shadow-lg w-[55%] mx-auto mt-6",
        className
      )}
    >
      {children}
    </div>
  );
};
export default Container;

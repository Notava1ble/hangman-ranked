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
        "bg-white p-6 rounded-md drop-shadow-lg w-[95%] sm:w-[85%] md:w-[80%] lg:w-[60%] mx-auto mt-6 transition-all",
        className
      )}
    >
      {children}
    </div>
  );
};
export default Container;

export const ContainerSkeleton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex-center bg-white p-6 rounded-md drop-shadow-lg h-16 w-[95%] sm:w-[85%] md:w-[80%] lg:w-[60%] mx-auto mt-6 transition-all",
        className
      )}
    >
      {children}
    </div>
  );
};

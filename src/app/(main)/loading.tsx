import { ContainerSkeleton } from "@/components/Container";
import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full flex-col-center pt-3 md:pt-16">
      <ContainerSkeleton>
        <Loader2Icon className="animate-spin" />
      </ContainerSkeleton>
      <ContainerSkeleton>
        <Loader2Icon className="animate-spin" />
      </ContainerSkeleton>
    </div>
  );
};
export default Loading;

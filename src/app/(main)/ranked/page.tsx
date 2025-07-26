import RankedGame from "@/components/RankedGame";

const Page = () => {
  return (
    // Start Ranked
    <div className="w-full h-full">
      <div className="w-full flex-center pt-8 md:pt-16">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Challenge other people
        </h1>
      </div>
      <RankedGame />
    </div>
  );
};
export default Page;

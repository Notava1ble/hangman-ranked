const Loading = () => {
  return (
    <div className="flex-center w-full h-full">
      <div className="bg-white rounded-md drop-shadow-lg w-[95%] lg:w-[55%] md:w-[75%] sm:w-[85%] mt-6 mb-6">
        <div className="p-6 bg-indigo-600 rounded-t-md text-white">
          <h2 className="text-3xl font-bold">🏆 Leaderboard</h2>
          <p className="mt-2">Top 100 Games and Players Worldwide</p>
        </div>
        <div className="p-6">
          <p className="text-center text-gray-500">Loading</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;

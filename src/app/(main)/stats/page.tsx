import CalendarHeatmapComponent from "@/components/CalendarHeatmapComponent";
import Container from "@/components/Container";
import LineChartComponent from "@/components/LineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDigitalTime, toSentenceCase } from "@/lib/utils";

const mockData = {
  header: {
    totalGames: 32,
    totalWins: 9,
    timeGuessing: 4272187, // In ms
  },
  pbs: {
    longestWordGuessed: "ecclesiastical",
    fastestWin: 5932, // In ms
    maxScore: 291,
    leastMistakes: 0,
    highestAccuracy: 1, // Highest % of correct guesses in a game
    mostWinsInADay: 12,
  },
  avarages: {
    // Have a toggle to include lost games or not
    withoutLossGames: {
      avarageScore: 197,
      avarageWordLength: 6.24,
      avarageGuesses: 5.21,
      avarageMistakes: 4.35,
      avarageTime: 34215, // In ms
    },
    withLossGames: {
      avarageScore: 102,
      avarageWordLength: 6.12,
      avarageGuesses: 8.21,
      avarageMistakes: 5.12,
      avarageTime: 17239, // In ms
    },
  },
  charts: {
    scoreOverGames: [
      243, 213, 271, 191, 189, 205, 242, 276, 255, 187, 123, 203, 310, 327, 273,
      301, 205, 243,
    ], // Line chart
    mistakesPerGame: [4, 2, 1, 3, 0, 2, 3, 1, 1, 5], // Bar chart
    guessesUsedPerGame: [7, 6, 5, 8, 4, 6, 5, 5, 6, 7], // Bar or line chart
    guessAccuracyPerGame: [70, 80, 75, 90, 100, 85, 60, 88, 95, 70], // Line chart
    gamesPerDay: [
      { date: new Date("2025-07-01"), count: 3 },
      { date: new Date("2025-07-02"), count: 5 },
      { date: new Date("2025-07-03"), count: 2 },
      { date: new Date("2025-07-04"), count: 0 },
      { date: new Date("2025-07-05"), count: 1 },
    ], // heatmap Github style

    // Show in the same heatmap or sum similar
    letterAppearedFrequency: {
      a: 226,
      b: 40,
      c: 153,
      d: 119,
      e: 437,
      f: 51,
      g: 82,
      h: 96,
      i: 257,
      j: 6,
      k: 14,
      l: 164,
      m: 98,
      n: 238,
      o: 240,
      p: 109,
      q: 8,
      r: 273,
      s: 241,
      t: 277,
      u: 120,
      v: 40,
      w: 38,
      x: 3,
      y: 48,
      z: 1,
    },
    letterGuessedFrequency: {
      a: 105,
      b: 44,
      c: 17,
      d: 52,
      e: 91,
      f: 19,
      g: 12,
      h: 10,
      i: 109,
      j: 9,
      k: 8,
      l: 38,
      m: 54,
      n: 43,
      o: 100,
      p: 78,
      q: 8,
      r: 92,
      s: 74,
      t: 62,
      u: 57,
      v: 14,
      w: 10,
      x: 2,
      y: 15,
      z: 2,
    },
    winRateBasedOnFirstGuess: {
      // Imma fill ts some other time
    },
  },
  curiosities: {
    mostCommonlyGuessedWrongLetter: "p",
    mostCommonlyGuessedCorrectLetter: "i",
  },
};

const Page = () => {
  // Achievement page and stats page
  return (
    <div className="w-full h-full mb-12">
      {/* HEADER */}
      <Container className="flex justify-around items-center p-4 relative gap-4">
        <div className="text-center">
          <p className="text-muted-foreground">Games:</p>
          <span className="text-3xl font-semibold">
            {mockData.header.totalGames}
          </span>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Wins:</p>
          <span className="text-3xl font-semibold">
            {mockData.header.totalWins}
          </span>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Time Guessing:</p>
          <span className="text-3xl font-semibold">
            {formatDigitalTime(mockData.header.timeGuessing)}
          </span>
        </div>
      </Container>
      {/* PBS */}
      <Container className="grid grid-cols-3 gap-4">
        {Object.entries(mockData.pbs).map((entry, _) => {
          return (
            <div key={_} className="text-center">
              <p className="text-muted-foreground">
                {toSentenceCase(entry[0])}
              </p>
              <span className="text-3xl font-semibold">{entry[1]}</span>
            </div>
          );
        })}
      </Container>
      {/* ACTIVITY */}
      <Container>
        <CalendarHeatmapComponent values={mockData.charts.gamesPerDay} />
      </Container>
      {/* AVARAGES (Make it smoother to show the difference between all and only won games, like hovering) */}
      <Container>
        <Tabs defaultValue="Won">
          <TabsList className="w-full">
            <TabsTrigger value="Won">Only won games</TabsTrigger>
            <TabsTrigger value="All">All games</TabsTrigger>
          </TabsList>
          <TabsContent value="Won" className="grid grid-cols-3 gap-4 mt-4">
            {Object.entries(mockData.avarages.withoutLossGames).map(
              (entry, i) => {
                return (
                  <div key={i} className={cn("text-center", i)}>
                    <p className="text-muted-foreground">
                      {toSentenceCase(entry[0])}
                    </p>
                    <span className="text-3xl font-semibold">{entry[1]}</span>
                  </div>
                );
              }
            )}
          </TabsContent>
          <TabsContent value="All" className="grid grid-cols-3 gap-4 mt-4">
            {Object.entries(mockData.avarages.withLossGames).map((entry, i) => {
              return (
                <div key={i} className={cn("text-center", i)}>
                  <p className="text-muted-foreground">
                    {toSentenceCase(entry[0])}
                  </p>
                  <span className="text-3xl font-semibold">{entry[1]}</span>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </Container>
      {/* Charts */}
      <Container className="pt-12 pr-8">
        <LineChartComponent
          chartConfig={{
            score: {
              label: "Score",
              color: "var(--chart-1)",
            },
          }}
          chartData={mockData.charts.scoreOverGames.map((score, game) => ({
            game: game.toString(),
            score,
          }))}
        />
        <h2 className="mb-4 mt-6 w-full text-center">Scores per Game</h2>
      </Container>
    </div>
  );
};
export default Page;

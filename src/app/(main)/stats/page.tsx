"use client";

import CalendarHeatmapComponent from "@/components/CalendarHeatmapComponent";
import Container from "@/components/Container";
import FrequencyGraph from "@/components/FrequencyGraph";
import LineChartComponent from "@/components/LineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDigitalTime, toSentenceCase } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

type Letter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

const Page = () => {
  const mockData = useQuery(api.user.getUserDetailedStats);

  if (mockData === null || mockData === undefined) {
    return (
      <div className="w-full h-full mb-12">
        <Container className="flex items-center justify-center">
          Log In to view your stats
        </Container>
      </div>
    );
  }

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
              color: "var(--chart-3)",
            },
          }}
          chartData={mockData.charts.scoreOverGames.map((score, game) => ({
            game: (game + 1).toString(),
            score,
          }))}
          lineType="linear"
        />
        <h2 className="mb-4 mt-6 w-full text-center">Scores per Game</h2>
      </Container>
      <Container>
        <Tabs defaultValue="guesses">
          <TabsList className="w-full">
            <TabsTrigger value="guesses">Guesses/Mistakes</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          </TabsList>
          <TabsContent value="guesses">
            <LineChartComponent
              className="mt-4"
              chartConfig={{
                guesses: {
                  label: "Guesses",
                  color: "var(--chart-2)",
                },
                mistakes: {
                  label: "Mistake",
                  color: "var(--chart-1)",
                },
              }}
              chartData={mockData.charts.guessesUsedPerGame.map(
                (guesses, game) => ({
                  game: (game + 1).toString(),
                  guesses,
                  mistakes: mockData.charts.mistakesPerGame[game] ?? 0,
                })
              )}
            />
            <h2 className="mb-4 mt-6 w-full text-center">Guesses per Game</h2>
          </TabsContent>
          <TabsContent value="accuracy">
            <LineChartComponent
              className="mt-4"
              chartConfig={{
                accuracy: {
                  label: "Accuracy",
                  color: "var(--chart-3)",
                },
              }}
              chartData={mockData.charts.guessAccuracyPerGame.map(
                (accuracy, game) => ({
                  game: game.toString(),
                  accuracy,
                })
              )}
            />
            <h2 className="mb-4 mt-6 w-full text-center">
              Guess accuracy per Game
            </h2>
          </TabsContent>
        </Tabs>
      </Container>
      <Container>
        <FrequencyGraph
          chartData={(
            Object.keys(mockData.charts.letterAppearedFrequency) as Letter[]
          ).map((letter) => ({
            letter,
            appeared: mockData.charts.letterAppearedFrequency[letter],
            guessed: mockData.charts.letterGuessedFrequency[letter],
          }))}
          chartConfig={{
            appeared: {
              label: "Appeared",
              color: "var(--ring)",
            },
            guessed: {
              label: "Guessed",
              color: "var(--chart-green)",
            },
          }}
        />
        <h2 className="mb-4 mt-6 w-full text-center">
          Letters appeared-guessed accuracy
        </h2>
      </Container>
    </div>
  );
};
export default Page;

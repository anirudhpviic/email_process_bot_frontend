import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Updated config for percentage representation
const chartConfig = {
  percentage: {
    label: "Match Percentage",
  },
  match: {
    label: "Email Match",
    color: "hsl(var(--chart-2))",
  },
};

export function EmailMatchChart({
  meaningMatchScore = 0,
  bestOne = "",
  whyItsBest = "",
}) {
  const chartData = [
    {
      type: "match",
      percentage: meaningMatchScore,
      fill: "var(--color-match)",
    },
  ];

  // Calculate the end angle based on the percentage (360 degrees * percentage / 100)
  const endAngle = (360 * meaningMatchScore) / 100;

  return (
    <Card className="flex flex-col mx-8 mb-10">
      <CardHeader className="pb-0">
        <CardTitle className="mx-auto">
          Email Comparison Match Percentage
        </CardTitle>
        <CardDescription className="mx-auto">
          <h2>
            <span className="font-bold">Best One : </span>
            {bestOne === "botGeneratedEmail"
              ? "Bot Generated"
              : "User Generated"}
          </h2>
          <h2>
            <span className="font-bold">Why its best : </span>
            {whyItsBest}
          </h2>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="percentage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {`${chartData[0].percentage}%`}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

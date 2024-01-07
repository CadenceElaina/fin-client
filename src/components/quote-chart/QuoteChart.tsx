import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { SA_KEY1, SA_URL } from "../../constants";
import axios from "axios";
import { formatTime, formatXAxis } from "./QuoteChartUtils";
import { queryClient } from "./quoteQueryClient";
import "./QuoteChart.css";

type ChartData = {
  time: string;
  close: number;
  formattedXAxis: string;
};

interface Values {
  close: number; // Adjust the type accordingly
  // Add other properties if necessary
}

const QuoteChart: React.FC<{
  interval: string;
  symbol: string;
  previousClosePrice: string;
}> = ({ interval, symbol, previousClosePrice }) => {
  console.log(interval, symbol);
  queryClient.setQueryDefaults(["chartData"], { gcTime: 1000 * 60 * 30 });
  const period = interval;

  let previousCloseWithoutSymbol = "";
  if (previousClosePrice !== undefined && previousClosePrice) {
    previousCloseWithoutSymbol = previousClosePrice.replace("$", "");
  }
  // Convert the string to a floating-point number using parseFloat()
  const previousCloseNumber = parseFloat(previousCloseWithoutSymbol);

  const fetchChartData = async (symbol: string, period: string) => {
    const chartQueryKey = ["chartData", symbol, period];

    // Check the cache first
    const cachedChartData = queryClient.getQueryData(chartQueryKey);
    if (cachedChartData) {
      console.log("Using cached chart data for", chartQueryKey);
      return { chartData: cachedChartData };
    }
    // If not in the cache, make the API call
    const options = {
      method: "GET",
      url: "https://seeking-alpha.p.rapidapi.com/symbols/get-chart",
      params: {
        symbol: `${symbol}`,
        period: `${period}`,
      },
      headers: {
        "X-RapidAPI-Key": `${SA_KEY1}`,
        "X-RapidAPI-Host": `${SA_URL}`,
      },
    };

    try {
      console.log("new api call QuoteChart.tsx");
      const response = await axios.request(options);
      console.log(response);

      const chartData = Object.entries(response.data.attributes).map(
        ([timestamp, values]: [string, Values]) => {
          const time = new Date(timestamp);
          // Format time for tooltip and x-axis
          const formattedTime = formatTime(time, interval);
          const formattedXAxis = formatXAxis(time, interval);
          /*console.log(formattedTime, formattedXAxis); */
          return {
            time: formattedTime,
            close: values.close,
            formattedXAxis: formattedXAxis,
          };
        }
      );
      console.log("chartData: ", chartData);
      // Cache the chart data
      queryClient.setQueryData(chartQueryKey, chartData);

      if (interval === "1D") {
        const previousCloseNumber = parseFloat(previousCloseWithoutSymbol);
        if (previousCloseNumber) {
          console.log("Previous Close:", previousCloseNumber);
          const finalClose = chartData[chartData.length - 1].close;
          console.log("Final Close:", finalClose);
        }
      }
      return { chartData };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chartData", symbol, period],
    queryFn: () => fetchChartData(symbol, period),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!data.chartData) return <div>No chart data available</div>;

  const uniqueDaysSet = new Set();
  const uniqueYearsSet = new Set();

  const chartData = (data.chartData as ChartData[]).map((entry) => {
    if (interval === "5Y" || interval === "MAX") {
      const year = entry.formattedXAxis;
      uniqueYearsSet.add(year);
      return {
        time: entry.time,
        close: entry.close,
        formattedXAxis: entry.formattedXAxis,
      };
    }
    if (
      interval === "1D" ||
      interval === "5D" ||
      interval === "1M" ||
      interval === "6M" ||
      interval === "YTD" ||
      interval === "1Y"
    ) {
      const day = entry.formattedXAxis;

      // Include the day in the set if it doesn't exist
      uniqueDaysSet.add(day);
      //console.log(entry.time);
      return {
        time: entry.time,
        close: entry.close,
        formattedXAxis: entry.formattedXAxis,
      };
    }
  });

  const uniqueDaysArray = Array.from(uniqueDaysSet);

  let lineStrokeColor = "#8884d8"; // Default color

  if (interval === "1D" && previousCloseNumber !== undefined) {
    const finalClose = chartData[chartData.length - 1].close;
    // Compare final close with previous close and set line color accordingly
    lineStrokeColor = finalClose > previousCloseNumber ? "green" : "red";
  } else if (interval !== "1D") {
    const initialPrice = chartData[0].close;
    const finalClose = chartData[chartData.length - 1].close;
    lineStrokeColor = finalClose > initialPrice ? "green" : "red";
  }
  const areaFill =
    lineStrokeColor === "red" ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)";
  // console.log(areaFill);
  return (
    <div className="chart-quote">
      <ResponsiveContainer width="100%" height={528}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedXAxis"
            tick={{ fontSize: 12 }}
            ticks={uniqueDaysArray as (string | number)[]}
          />
          <YAxis
            scale="linear"
            domain={
              interval === "1D" && previousCloseNumber !== 0
                ? [previousCloseNumber, "auto"]
                : ["auto", "auto"]
            }
          />
          <Tooltip
            content={({ payload }) => {
              /*   console.log(payload); */
              if (!payload || payload.length === 0 || !payload[0].payload) {
                return null;
              }
              if (payload && payload.length > 0) {
                const { time, close } = payload[0].payload;
                return (
                  <div className="custom-tooltip">
                    <p>{`Time: ${time}`}</p>
                    <p>{`Price: ${close}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Area
            type="monotone"
            dataKey="close"
            fill={areaFill}
            stroke={lineStrokeColor}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke={lineStrokeColor}
            dot={false}
          />
          {interval === "1D" &&
            previousCloseNumber !== undefined &&
            previousCloseNumber !== 0 && (
              <>
                {/* Horizontal Dotted Line */}
                <ReferenceLine
                  y={previousCloseNumber}
                  stroke="black"
                  strokeDasharray="3 3"
                  label={`Prev close ${previousCloseNumber}`}
                />

                {/* Reference Dot with Label */}
                <ReferenceDot
                  x={chartData[chartData.length - 1].formattedXAxis} // X-coordinate of the dot (last data point)
                  y={previousCloseNumber} // Y-coordinate of the dot (previous close price)
                  r={0} // Radius of the dot
                  fill="white" // Dot color
                  stroke="none"
                >
                  {/* Label for the dot */}
                  <text x={10} y={-10} dy={-4} fontSize={12} fill="white">
                    Prev close
                  </text>
                  <text x={10} y={-10} dy={12} fontSize={12} fill="black">
                    ${previousCloseNumber}
                  </text>
                </ReferenceDot>
              </>
            )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuoteChart;

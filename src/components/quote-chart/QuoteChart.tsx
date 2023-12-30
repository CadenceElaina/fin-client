import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { SA_KEY, SA_URL } from "../../constants";
import axios from "axios";

const QuoteChart: React.FC<{ interval: string }> = ({ interval }) => {
  const symbol = "msft";
  const period = interval;

  const formatTime = (time: Date, interval: string) => {
    switch (interval) {
      case "1D":
        return time.toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        break;
      case "5D":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        break;
      case "1M":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      case "6M":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      case "YTD":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      case "1Y":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      case "5Y":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      case "MAX":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      default:
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
    }
  };

  const formatXAxis = (time: Date, interval: string) => {
    switch (interval) {
      case "1D":
        return time.toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      case "5D":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "1M":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "6M":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "YTD":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "1Y":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "5Y":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "MAX":
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      default:
        return time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
    }
  };

  const fetchChartData = async (symbol: string, period: string) => {
    const options = {
      method: "GET",
      url: "https://seeking-alpha.p.rapidapi.com/symbols/get-chart",
      params: {
        symbol: `${symbol}`,
        period: `${period}`,
      },
      headers: {
        "X-RapidAPI-Key": `${SA_KEY}`,
        "X-RapidAPI-Host": `${SA_URL}`,
      },
    };

    try {
      console.log("runs ");
      const response = await axios.request(options);
      console.log(response);

      const chartData = Object.entries(response.data.attributes).map(
        ([timestamp, values]) => {
          const time = new Date(timestamp);

          // Format time for tooltip and x-axis
          const formattedTime = formatTime(time, interval);
          const formattedXAxis = formatXAxis(time, interval);
          /*           console.log(formattedTime, formattedXAxis); */
          return {
            time: formattedTime,
            close: values.close,
            formattedXAxis: formattedXAxis,
          };
        }
      );
      console.log("unsorted: ", chartData);
      chartData.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      console.log("sorted chartData: ", chartData);

      return { chartData };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chartData", symbol, period],
    queryFn: () => fetchChartData(symbol, period),
    // You can set cache options here
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!data.chartData) return <div>No chart data available</div>;
  /*   const chartData = data.chartData.map((entry) => ({
    time: entry.time,
    close: entry.close,
  })); */
  const uniqueDaysSet = new Set();

  const chartData = data.chartData
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .map((entry, index) => {
      const day = entry.formattedXAxis;

      // Include the day in the set if it doesn't exist
      uniqueDaysSet.add(day);
      console.log(entry.time);
      return {
        time: entry.time,
        close: entry.close,
        formattedXAxis: entry.formattedXAxis,
      };
    });

  const uniqueDaysArray = Array.from(uniqueDaysSet);
  console.log(uniqueDaysArray);
  console.log(chartData);

  return (
    <div className="chart-quote">
      <ResponsiveContainer width="100%" height={528}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedXAxis"
            tick={{ fontSize: 12 }}
            ticks={uniqueDaysArray}
          />
          <YAxis scale="linear" domain={["auto", "auto"]} />
          <Tooltip
            content={({ payload, label }) => {
              console.log(payload);
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
          <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuoteChart;

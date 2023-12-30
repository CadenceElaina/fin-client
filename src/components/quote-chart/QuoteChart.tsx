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

type AxisConfig = {
  id: string;
  type: string; // or a more specific type based on your needs
  // ... other properties
};

const QuoteChart: React.FC = () => {
  const symbol = "msft";
  const period = "1D";
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
          const formattedTime = time.toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          return {
            time: formattedTime,
            close: values.close,
          };
        }
      );
      console.log(chartData);

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
  const chartData = data.chartData.map((entry) => ({
    time: entry.time,
    close: entry.close,
  }));

  return (
    <div className="chart-quote">
      <ResponsiveContainer width="100%" height={528}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis scale="linear" domain={["auto", "auto"]} />
          <Tooltip
            content={({ payload, label }) => {
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

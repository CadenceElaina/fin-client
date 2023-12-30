import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { QueryClientProvider } from "./quoteQueryClient";
import useChartData from "../../hooks/useQuoteChartData";
import { LineChart } from "@mui/x-charts/LineChart";

const QuoteChart: React.FC = () => {
  const location = useLocation();
  const { symbol } = useParams();
  const { search } = location;
  const searchParams = new URLSearchParams(search);
  const interval = searchParams.get("interval") || "1D"; // Default to 1D if not specified

  /*   const { data, isLoading, isError } = useChartData(symbol || "", interval); */

  /*   if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>; */

  // Your chart rendering logic here using the data
  /*   const chartData
  const volumeData */

  return (
    <div>
      QuoteChart{" "}
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
};

export default QuoteChart;

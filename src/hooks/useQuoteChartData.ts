import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SA_KEY, SA_URL } from "../constants";
import axios from "axios";

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
    const response = await axios.request(options);
    return response.data; // Return the actual data
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data"); // Throw an error to be caught by useQuery
  }
};

const useChartData = (symbol: string, interval: string) => {
  return useQuery(["chartData", symbol, interval], () =>
    fetchChartData(symbol, interval)
  );
};

export default useChartData;

import React, { useEffect, useState } from "react";
import Portfolio from "./Portfolio";
import Table from "../table/Table";
import { RowConfig } from "../table/types";
import { quoteType, utils } from "../search/types";
import {
  Data,
  transformQuotesToDataWithQuantities,
} from "../market-trends/utils";
import { getQuote } from "../search/quoteUtils";
import { useQueryClient } from "@tanstack/react-query";
import portfolioService from "../../services/portfolios";
import PortfolioChart from "../PortfolioChart";
import "./Portfolio.css";

interface PortfolioPerformanceProps {
  portfolio: Portfolio;
}

const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  portfolio,
}) => {
  //const [symbols, setSymbols] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Data[]>();
  /*   const [chartData, setChartData] = useState([
    ["Date", "Value of portfolio"],
    ["Dec 21, 2023", 0],
  ]); */
  const [portfolioPerformance, setPortfolioPerformance] = useState({
    totalPriceChange: 0,
    totalPercentChange: 0,
  });
  const queryClient = useQueryClient();

  const portfolioConfig: RowConfig = {
    fields: [
      "symbol",
      "name",
      "price",
      "quantity",
      "priceChange",
      "percentChange",
    ],
    addIcon: true,
  };
  console.log(portfolio);

  const fetchQuotesForSymbols = async () => {
    const symbols = portfolio?.securities?.map((s) => s.symbol);
    const quotePromises = symbols?.map(async (symbol: string) => {
      // Check the cache first
      const cachedQuote = queryClient.getQueryData(["quote", symbol]);

      if (cachedQuote) {
        const newCachedQuote = utils.checkCachedQuoteType(cachedQuote);
        console.log("quoteUtils.ts - got cached quote:", cachedQuote);
        return newCachedQuote;
      }

      // If not in the cache, make an API call
      console.log("quoteUtils.ts - new api request -", symbol);
      const quoteData = await getQuote(queryClient, symbol);
      await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms delay
      // Update the cache
      queryClient.setQueryData(["quote", symbol], quoteData);

      return quoteData;
    });
    const promisesPlaceholder = [
      {
        symbol: "",
        name: "",
        price: 0,
        priceChange: 0,
        percentChange: 0,
      },
    ];
    const quotes = await Promise.all(quotePromises ?? promisesPlaceholder);

    const symbolQuoteMap: Record<string, quoteType | null> = {};
    symbols?.forEach((symbol, index) => {
      symbolQuoteMap[symbol] = quotes[index];
    });
    const transformedData: Data[] = transformQuotesToDataWithQuantities(
      symbolQuoteMap,
      portfolio
    );
    const convertToNumber = (str: string) => parseFloat(str);
    // Calculate total price change and total percent change
    const totalPriceChange = transformedData.reduce(
      (total, item) =>
        total +
        convertToNumber(item.priceChange.toString()) * (item.quantity ?? 0),
      0
    );
    const formattedTotalPriceChange = Number(totalPriceChange.toFixed(2));
    const totalQuantity = transformedData.reduce(
      (tq, security) => (tq += security.quantity ?? 0),
      0
    );
    const overallPercentChange =
      transformedData.reduce(
        (pc, curr) => (pc += curr.percentChange * (curr.quantity ?? 0)),
        0
      ) / totalQuantity;
    const formattedOverallPercentChange = Number(
      overallPercentChange.toFixed(2)
    );
    console.log("transformedData", transformedData);

    setQuotes(transformedData);
    const totalValue = transformedData.reduce(
      (value, security) => (value += security.price * (security.quantity ?? 0)),
      0
    );
    setPortfolioPerformance({
      totalPriceChange: formattedTotalPriceChange,
      totalPercentChange: formattedOverallPercentChange,
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // Check if the current date is already present in portfolioValue
    const isCurrentDatePresent = portfolio?.portfolioValue?.some(
      (entry) => entry.date === formattedDate
    );
    const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    // Check if the day is not Saturday (6) or Sunday (0)
    if (!isCurrentDatePresent && dayOfWeek !== 0 && dayOfWeek !== 6) {
      const response = await portfolioService.updatePortfolioValue(
        portfolio.id,
        {
          date: formattedDate,
          value: Number(totalValue.toFixed(2)),
        }
      );
      console.log("response", response); // Access response.data
    }

    /*     setChartData([formattedDate, formattedTotalPriceChange]) */
  };

  useEffect(() => {
    const symbols = portfolio?.securities?.map((s) => s.symbol);
    if (symbols && symbols.length > 0) {
      fetchQuotesForSymbols();
    }
  }, [portfolio, queryClient]);

  console.log(quotes, portfolioPerformance);
  const p = {
    priceChange: -1.0,
    totalPriceChange: -2.2,
  };
  /*   console.log(portfolio?.title, portfolio.portfolioValue); */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertPortfolioValueToNumbers = (portfolioValue: any[]) => {
    return portfolioValue.map((entry) => ({
      date: entry.date,
      value: parseFloat(entry.value),
    }));
  };
  const updatedPortfolioValue = convertPortfolioValueToNumbers(
    portfolio?.portfolioValue || []
  );
  return (
    <div className="portfolio-performance-container">
      <div className="top-row">
        <div className="portfolio-chart-container">
          {portfolio && portfolio.title && portfolio.portfolioValue && (
            <PortfolioChart
              chartName={portfolio.title ?? ""}
              data={updatedPortfolioValue || []}
            />
          )}
        </div>
        <div className="portfolio-highlights">
          <div role="heading">Portfolio highlights</div>
          <div className="portfolio-day-total-change">
            <div
              className={`portfolio-day-${
                p.priceChange > 0 ? "gain" : p.priceChange < 0 ? "loss" : ""
              }`}
            >
              Day{" "}
              {p.priceChange > 0 ? "gain" : p.priceChange === 0 ? "" : "loss"}
              <div
                className={`portfolio-day-change-${
                  p.priceChange > 0 ? "gain" : p.priceChange === 0 ? "" : "loss"
                }`}
              >
                <div>{portfolioPerformance.totalPriceChange}</div>
                <div>{portfolioPerformance.totalPercentChange}</div>
              </div>
            </div>
            <div
              className={`total-${
                p.totalPriceChange > 0
                  ? "gain"
                  : p.totalPriceChange === 0
                  ? ""
                  : "loss"
              }`}
            >
              Total{" "}
              {p.totalPriceChange > 0
                ? "gain"
                : p.totalPriceChange === 0
                ? ""
                : "loss"}
              <div
                className={`portfolio-total-change-${
                  p.priceChange > 0 ? "gain" : p.priceChange === 0 ? "" : "loss"
                }`}
              >
                <div>{portfolioPerformance.totalPriceChange}</div>
                <div>{portfolioPerformance.totalPercentChange}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-row">
        <div className="portfolio-performance-list">
          {portfolio && portfolio.securities && quotes && (
            <Table
              data={quotes}
              config={portfolioConfig}
              full={true}
              icon={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;

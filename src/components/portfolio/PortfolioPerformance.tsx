import React, { useEffect, useState } from "react";
import { usePortfolios } from "../../context/PortfoliosContext";
import Portfolio from "./Portfolio";
import Table from "../table/Table";
import { RowConfig } from "../table/types";
import { quoteType, utils } from "../search/types";
import { transformQuotesToDataWithQuantities } from "../market-trends/utils";
import { getQuote } from "../search/quoteUtils";
import { useQueryClient } from "@tanstack/react-query";
import portfolioService from "../../services/portfolios";
import Chart from "../Chart";

interface PortfolioPerformanceProps {
  portfolio: Portfolio;
}

const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  portfolio,
}) => {
  //const [symbols, setSymbols] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Record<string, quoteType | null>>();
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
    const quotePromises = symbols.map(async (symbol: string) => {
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

    const quotes = await Promise.all(quotePromises);

    const symbolQuoteMap: Record<string, quoteType | null> = {};
    symbols.forEach((symbol, index) => {
      symbolQuoteMap[symbol] = quotes[index];
    });
    const transformedData = transformQuotesToDataWithQuantities(
      symbolQuoteMap,
      portfolio
    );
    const convertToNumber = (str) => parseFloat(str);
    // Calculate total price change and total percent change
    const totalPriceChange = transformedData.reduce(
      (total, item) =>
        total + convertToNumber(item.priceChange) * item.quantity,
      0
    );
    const formattedTotalPriceChange = Number(totalPriceChange.toFixed(2));
    const totalQuantity = transformedData.reduce(
      (tq, security) => (tq += security.quantity),
      0
    );
    const overallPercentChange =
      transformedData.reduce(
        (pc, curr, i) => (pc += curr.percentChange * curr.quantity),
        0
      ) / totalQuantity;
    const formattedOverallPercentChange = Number(
      overallPercentChange.toFixed(2)
    );
    console.log("transformedData", transformedData);

    setQuotes(transformedData);
    const totalValue = transformedData.reduce(
      (value, security) => (value += security.price * security.quantity),
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

    if (!isCurrentDatePresent) {
      const response = await portfolioService.updatePortfolioValue(
        portfolio.id,
        {
          date: formattedDate,
          value: totalValue.toFixed(2),
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
    priceChange: 1.0,
    totalPriceChange: 2.2,
  };
  return (
    <div className="portfolio-performance-container">
      <div className="portfolio-chart">chart {/* <Chart data={} /> */}</div>
      <div className="portfolio-highlights">
        <div
          className={`portfolio-day-${
            p.priceChange > 0 ? "gain" : p.priceChange < 0 ? "loss" : ""
          }`}
        >
          Day {p.priceChange > 0 ? "gain" : p.priceChange === 0 ? "" : "loss"}
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
          Total
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
      {portfolio && portfolio.securities && quotes && (
        <Table data={quotes} config={portfolioConfig} full={true} />
      )}
    </div>
  );
};

export default PortfolioPerformance;

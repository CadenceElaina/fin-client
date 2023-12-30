import React, { useEffect, useState } from "react";
import Table from "./table/Table";
import { RowConfig } from "./table/types";
import { ImFire } from "react-icons/im";
import { RiBarChart2Fill } from "react-icons/ri";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { getMoversSymbols, getQuote } from "./search/quoteUtils";
import { quoteType, utils } from "./search/types";
import { transformQuotesToData } from "./market-trends/utils";

const data = [
  {
    id: 123,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
    article: {
      title:
        "https://www.bloomberg.com/news/articles/2023-12-06/citi-cfo-sees-trading-revenue-dropping-as-much-as-20-in-quarter",
      source: "MSN",
      time: "2 hours ago",
    },
  },
  {
    id: 234,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: -4.4,
    percentChange: -2.3,
  },
  {
    id: 345,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 456,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
    article: {
      title:
        "https://www.bloomberg.com/news/articles/2023-12-06/citi-cfo-sees-trading-revenue-dropping-as-much-as-20-in-quarter",
      source: "Bloomberg",
      time: "4 hours ago",
    },
  },
  {
    id: 567,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
];

const MarketTrendsList = () => {
  const marketTrendsConfig: RowConfig = {
    fields: ["symbol", "name", "article", "price", "percentChange"],
    addIcon: true,
    name: "market-trends",
  };
  const [symbols, setSymbols] = useState<string[]>([]);
  /* const mostActiveConfig: RowConfig = {
    fields: ["symbol", "name", "price", "priceChange", "percentChange"],
    addIcon: true,
  }; */
  const queryClient = useQueryClient();
  const [mostActiveQuotes, setMostActiveQuotes] = useState<
    Record<string, quoteType | null>
  >({});

  const fetchMostActiveQuotes = async () => {
    try {
      const newSymbols = await getMoversSymbols("active");

      setSymbols(newSymbols);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuotesForSymbols = async () => {
    const quotePromises = symbols.map(async (symbol) => {
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

    setMostActiveQuotes(symbolQuoteMap);
  };

  useEffect(() => {
    fetchMostActiveQuotes();
  }, [queryClient]);

  useEffect(() => {
    if (symbols.length > 0) {
      fetchQuotesForSymbols();
    }
  }, [symbols, queryClient]);

  return (
    <>
      <div role="heading" className="home-market-trends-heading">
        Market trends
      </div>
      <div className="home-market-trends-buttons">
        <CustomButton
          label="Most Active"
          secondary
          icon={<RiBarChart2Fill />}
          onClick={() => console.log("")}
        />
        <CustomButton
          label="Trending"
          secondary
          icon={<ImFire />}
          onClick={() => console.log("")}
        />
      </div>
      <div>
        <Link to={"/market-trends/active"}>
          More
          <MdArrowForwardIos />
        </Link>
      </div>
      <div className="market-trends-list">
        <Table
          data={transformQuotesToData(mostActiveQuotes)}
          config={marketTrendsConfig}
          full={true}
          icon={true}
        />
      </div>
    </>
  );
};

export default MarketTrendsList;

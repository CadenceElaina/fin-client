import React, { useEffect, useState } from "react";
import Table from "../table/Table";
import "../../App.css";
import { RowConfig } from "../table/types";
import { useWatchlists } from "../../context/WatchlistContext";
import { getQuote } from "../search/quoteUtils";
import { quoteType } from "../search/types";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { usePortfolios } from "../../context/PortfoliosContext";
import { useAuth } from "../../context/AuthContext";
import { Quote, QuotesMap } from "../../types/types";
interface PortfolioSymbols {
  [portfolioTitle: string]: { [symbol: string]: number };
}
const Watchlist = () => {
  const { portfolios, appendPortfolio } = usePortfolios();
  const { watchlists } = useWatchlists();
  const { user } = useAuth();
  const auth = !!user;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchlistsAndPortfoliosQuotes, setWatchlistsAndPortfoliosQuotes] =
    useState<
      | {
          percentChange: number;
          symbol?: string | undefined;
          price?: number | undefined;
          priceChange?: number | undefined;
          quantity?: number | undefined;
        }[]
      | undefined
    >();
  const portfolioSymbols: PortfolioSymbols = {};

  // Populate the object with symbols and quantities
  portfolios.forEach((portfolio) => {
    const symbolsWithQuantities =
      portfolio.securities?.reduce((acc, security) => {
        acc[security.symbol] = security.quantity;
        return acc;
      }, {} as { [symbol: string]: number }) || {};

    portfolioSymbols[portfolio.title] = symbolsWithQuantities;
  });

  const queryClient = useQueryClient();
  const [portfolioQuotes, setPortfolioQuotes] = useState<
    Record<
      string,
      Array<
        | {
            symbol: string;
            price: number;
            percentChange: number;
            priceChange: number;
            quantity: number;
          }
        | undefined
      >
    >
  >({});
  /*  const [portfolioQuotes, setPortfolioQuotes] = useState<
    Record<
      string,
      {
        symbol: string;
        price: number;
        percentChange: number;
        priceChange: number;
        quantity: number;
      }[]
    >
  >({}); */
  const [quoteCache, setQuoteCache] = useState<
    Record<string, quoteType | null>
  >({});
  const [watchlistQuotes, setWatchlistQuotes] = useState<
    Record<
      string,
      {
        symbol: string;
        price: number;
        percentChange: number;
        priceChange: number;
        quantity?: number;
      }[]
    >
  >({});
  const fetchPortfolioQuotes = async (portfolioTitle: string) => {
    const symbolsWithQuantities = portfolioSymbols[portfolioTitle];

    const quotePromises = Object.entries(symbolsWithQuantities).map(
      async ([symbol, quantity]) => {
        // Check the cache first
        const cachedQuote = quoteCache[symbol];

        if (cachedQuote) {
          const pc = cachedQuote?.percentChange * 100;

          return {
            symbol,
            name: cachedQuote?.name,
            price: cachedQuote?.price || 0,
            percentChange: pc || 0,
            priceChange: cachedQuote?.priceChange || 0,
            quantity,
          };
        } else {
          // If not in the cache, make an API call
          const quoteData = await getQuote(queryClient, symbol);
          console.log("new api call fetchPortfolioQuotes - Watchlist.tsx");
          // Update the cache
          setQuoteCache((prevCache) => ({
            ...prevCache,
            [symbol]: quoteData,
          }));

          let pc = 0;
          if (quoteData?.percentChange) {
            pc = quoteData.percentChange * 100;
          }
          console.log(pc);

          return {
            symbol,
            name: quoteData?.name,
            price: quoteData?.price || 0,
            percentChange: pc || 0,
            priceChange: quoteCache[symbol]?.priceChange || 0,
            quantity,
          };
        }
      }
    );

    const quotes = await Promise.all(quotePromises);

    setPortfolioQuotes((prevQuotes) => ({
      ...prevQuotes,
      [portfolioTitle]: quotes,
    }));
  };

  useEffect(() => {
    // Fetch quotes for each portfolio
    portfolios.forEach((portfolio) => {
      fetchPortfolioQuotes(portfolio.title);
    });
  }, [portfolios, quoteCache]);

  const fetchWatchlistQuotes = async () => {
    const symbols: string[] = [];

    // Get all unique symbols from watchlists
    watchlists.forEach((watchlist) => {
      if (watchlist.securities) {
        watchlist.securities.forEach((security) => {
          symbols.push(security.symbol);
        });
      }
    });
    //  console.log(symbols);
    // Remove duplicate symbols
    const uniqueSymbols = [...new Set(symbols)];
    // console.log("uniqueSymbols", uniqueSymbols);
    // Check if the symbol is already in the portfolioQuotes
    const symbolsInPortfolios = Object.values(portfolioQuotes)
      .flat()
      .map((quote) => (quote ? quote.symbol : undefined))
      .filter((symbol) => symbol !== undefined) as string[];
    const symbolsToFetch = uniqueSymbols.filter(
      (symbol) => !symbolsInPortfolios.includes(symbol)
    );
    // Check if the symbol is already in the cache
    console.log("symbolsinPortfolios", symbolsInPortfolios);
    const quotesPromises = symbolsToFetch.map(async (symbol) => {
      const cachedQuote = queryClient.getQueryData(["quote", symbol]) as
        | quoteType
        | undefined;

      if (cachedQuote) {
        console.log("cachedqQuote", cachedQuote);
        return {
          symbol,
          name: cachedQuote.name,
          price: cachedQuote.price ?? 0,
          percentChange: cachedQuote.percentChange * 100 ?? 0,
          priceChange: cachedQuote.priceChange ?? 0,
        };
      }

      // If not in the cache, make an API call
      const quoteData = await getQuote(queryClient, symbol);
      console.log("made api call fetchWatchlistQuotes");
      let pc = 0;
      if (quoteData?.percentChange) {
        pc = quoteData.percentChange * 100;
      }
      //  console.log(pc);
      //  console.log(symbol);
      return {
        symbol,
        name: quoteData?.name,
        price: quoteData?.price ?? 0,
        percentChange: pc ?? 0,
        priceChange: quoteData?.priceChange ?? 0,
      };
    });

    const quotes = await Promise.all(quotesPromises);

    const quotesMap: Record<string, any[]> = {};
    quotes.forEach((quote) => {
      if (quote) {
        const { symbol, ...rest } = quote;
        if (!quotesMap[symbol]) {
          quotesMap[symbol] = [];
        }
        quotesMap[symbol].push(rest);
      }
    });

    setWatchlistQuotes(quotesMap);
    console.log(quotesMap);
  };

  useEffect(() => {
    // Check if portfolioQuotes has been fetched
    if (Object.keys(portfolioQuotes).length > 0) {
      // Fetch watchlist quotes
      fetchWatchlistQuotes();
    }
  }, [portfolioQuotes]);

  const watchlistConfig: RowConfig = {
    fields: ["symbol", "name", "price", "percentChange", "priceChange"],
    removeIcon: true,
  };
  useEffect(() => {
    // Check if portfolioQuotes and watchlistQuotes have been fetched
    if (
      Object.keys(portfolioQuotes).length > 0 &&
      Object.keys(watchlistQuotes).length > 0
    ) {
      // Convert watchlistQuotes to the desired format
      const formattedWatchlistQuotes: {
        symbol: string;
        price: number;
        percentChange: number;
        priceChange: number;
        quantity: number; // Set quantity to be explicitly of type number
      }[] = Object.entries(watchlistQuotes).flatMap(([symbol, quotes]) =>
        quotes.map((quote) => ({
          symbol,
          ...quote,
          quantity: quote.quantity || 0,
        }))
      );

      // Combine portfolioQuotes and formattedWatchlistQuotes into a single array
      const allQuotes = Object.values(portfolioQuotes)
        .flat()
        .concat(formattedWatchlistQuotes);

      // Format percentChange to two decimal places
      const formattedQuotes = allQuotes.map((quote) => ({
        ...quote,
        percentChange: Number((quote?.percentChange || 0).toFixed(2)),
      }));

      // Sort the array based on percentChange in descending order
      const sortedQuotes = formattedQuotes.sort(
        (a, b) => b.percentChange - a.percentChange
      );

      // Take the top 5 securities or as many as available
      const topQuotesCount = Math.min(sortedQuotes.length, 5);
      const topQuotes = sortedQuotes.slice(0, topQuotesCount);

      // Update state with the top quotes
      setWatchlistsAndPortfoliosQuotes(topQuotes);
    }
  }, [portfolioQuotes, watchlistQuotes]);
  console.log(
    /*     watchlists,
    "ports",
    portfolios, */
    portfolioQuotes,
    watchlistQuotes,
    watchlistsAndPortfoliosQuotes
  );
  //if we have portfolios and / or watchlists then return 5 securities with the largest change
  //otherwise if no lists and/or not signed in we show you may be interested in list
  return (
    <>
      {auth && (
        <div className="table-container">
          {" "}
          <div role="heading" className="watchlist-heading">
            Top movers in your lists
          </div>
          <Table
            data={watchlistsAndPortfoliosQuotes}
            config={watchlistConfig}
            full={true}
            icon={true}
          />
        </div>
      )}
    </>
  );
};

export default Watchlist;

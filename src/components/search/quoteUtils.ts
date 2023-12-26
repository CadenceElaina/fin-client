import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { quoteType, utils } from "./types";
import {
  YH_KEY,
  YH_URL,
  YH_KEY1,
  YH_KEY2,
  YH_URL1,
  YH_URL2,
} from "../../constants";

export const getQuote = async (queryClient: QueryClient, symbol: string) => {
  return console.log("lol sorry no api calls for you");
};
export const fetchQuoteWithRetry = async (symbol, retryCount = 3) => {
  try {
    console.log("sorry");
    return;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount > 0) {
      // Retry with backoff after waiting for a certain time
      /*    const waitTime = Math.pow(2, 4 - retryCount) * 1000; // exponential backoff
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return fetchQuoteWithRetry(symbol, retryCount - 1); */
    } else {
      // Handle other errors or propagate if no retries left
      throw error;
    }
  }
};
/* export const getQuote = async (
  queryClient: QueryClient,
  symbol: string
): Promise<quoteType | null> => {
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
    params: { symbol, region: "US" },
    headers: {
      "X-RapidAPI-Key": `${YH_KEY}`,
      "X-RapidAPI-Host": `${YH_URL}`,
    },
  };

  try {
    // Try to get cached data
    const cachedQuote = queryClient.getQueryData(["quote", symbol]);

    if (cachedQuote) {
      const newCachedQuote = utils.checkCachedQuoteType(cachedQuote);
      console.log("quoteUtils.ts - got cached quote:", cachedQuote);
      return newCachedQuote;
    }

    // If not cached, make an API call
    console.log("quoteUtils.ts - new api request -", symbol);
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
    const response = await axios.request(options);

    if (!response.data.quoteType || !response.data.price) {
      throw new Error("Incomplete or missing data in the API response");
    }

    const temp = response.data.quoteType.symbol;
    const quoteData: quoteType = {
      symbol: temp.toLowerCase(),
      price: response.data.price.regularMarketPrice.raw,
      name: response.data.price.shortName,
      priceChange: response.data.price.regularMarketChange.fmt,
      percentChange: response.data.price.regularMarketChangePercent.raw,
    };
    //
    // Cache the quote data
    queryClient.setQueryData(["quote", symbol], quoteData);
    console.log(quoteData);
    return quoteData;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const fetchQuoteWithRetry = async (symbol, retryCount = 3) => {
  try {
    const quoteData = await getQuote(queryClient, symbol);
    return quoteData;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount > 0) {
      // Retry with backoff after waiting for a certain time
      const waitTime = Math.pow(2, 4 - retryCount) * 1000; // exponential backoff
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return fetchQuoteWithRetry(symbol, retryCount - 1);
    } else {
      // Handle other errors or propagate if no retries left
      throw error;
    }
  }
}; */

/* interface ApiResponse {
  quoteResponse: {
    result: Array<{
      symbol: string;
      regularMarketPrice: number;
      shortName: string;
      regularMarketChange: number;
      regularMarketChangePercent: number;
    }>;
  };
} */

export interface Symbols {
  symbols: string;
}

export const getMoversSymbols = async (
  title: string
): /*   queryClient: QueryClient */
Promise<string[]> => {
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers",
    params: {
      region: "US",
      lang: "en-US",
      start: "0",
      count: "5",
    },
    headers: {
      "X-RapidAPI-Key": `${YH_KEY2}`,
      "X-RapidAPI-Host": `${YH_URL2}`,
    },
  };

  try {
    console.log("get movers runs");
    // Try to get cached data
    /*  const cachedQuotes: Record<string, quoteType | null> = {};

    // Iterate over symbols to check cache
    for (let i = 0; i < 5; i++) {
      const symbol = `symbol${i}`; // Replace with the actual way you get the symbol
      const cachedQuote = queryClient.getQueryData(["quote", symbol]);

      if (cachedQuote) {
        const newCachedQuote = utils.checkCachedQuoteType(cachedQuote);
        console.log("quoteUtils.ts - got cached quote:", cachedQuote);
        cachedQuotes[symbol] = newCachedQuote;
      }
    }

    // Check if all quotes are cached
    const allQuotesCached = Object.values(cachedQuotes).every(
      (quote) => quote !== null
    );

    if (allQuotesCached) {
      console.log("get movers all quotes were cached");
      return cachedQuotes;
    } */

    // If not all quotes are cached, make an API call
    console.log("quoteUtils.ts - new api request - get movers");
    const response = await axios.request<any>(options);

    /*  if (!response || !response.quoteResponse || !response.quoteResponse || !response.data.quoteResponse.result) {
      throw new Error("Incomplete or missing data in the API response");
    } */
    console.log(response.data.finance.result[2]);
    //const data = response.data.finance.result[2]
    // Map over response.quoteResponse.result[]
    /*     const newQuotes: Record<string, quoteType | null> = {}; */
    const symbols: string[] = [];
    let resultIndex;
    if (title === "active") {
      resultIndex = 2;
    } else if (title === "losers") {
      console.log("resultIndex losers");
      resultIndex = 1;
    } else {
      resultIndex = 0;
    }
    response.data.finance.result[resultIndex].quotes.map(
      (q: any, i: number) => {
        symbols.push(q.symbol); // Replace with the actual way you get the symbol
        /*   const price = q.regularMarketPrice;
      const name = q.shortName;
      const priceChange = q.regularMarketChange;
      const percentChange = q.regularMarketChangePercent;
 */
        /*  const quoteData: quoteType = {
        symbol: symbol.toLowerCase(),
        price,
        name,
        priceChange,
        percentChange,
      }; */
        /*       console.log(quoteData); */
        // Cache the quote data
        /*   queryClient.setQueryData(["quote", symbol], quoteData);
      newQuotes[symbol] = quoteData; */
      }
    );

    return symbols;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTrending = async (queryClient: QueryClient) => {
  const cachedData = queryClient.getQueryData(["trending"]);

  if (cachedData) {
    console.log("Using cached data for trending", cachedData);
    return cachedData;
  }

  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers",
    params: { region: "US" },
    headers: {
      "X-RapidAPI-Key": `${YH_KEY2}`,
      "X-RapidAPI-Host": `${YH_URL}`,
    },
  };

  try {
    console.log("new api request - getTrending");
    const response = await axios.request(options);
    const trendingQuotes = response.data.finance.result[0].quotes.map(
      (q: any) => ({
        symbol: q.symbol,
        name: q.shortName,
        price: q.regularMarketPrice,
        priceChange: q.regularMarketChange.toFixed(2),
        percentChange: q.regularMarketChangePercent.toFixed(2),
      })
    );

    // Cache the data
    queryClient.setQueryData(["trending"], trendingQuotes);

    return trendingQuotes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

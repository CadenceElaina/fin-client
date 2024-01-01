import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  QuotePageData,
  QuotePageFinancialData,
  QuotePageSidebarAboutData,
  QuotePageSidebarData,
  previousClose,
  quoteType,
  utils,
} from "./types";
import {
  YH_KEY,
  YH_URL,
  YH_KEY1,
  YH_KEY2,
  YH_URL1,
  YH_URL2,
  YH_KEY3,
} from "../../constants";

const stateAbbreviations: { [key: string]: string } = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};
const getStateFullName = (abbreviation: string): string | undefined => {
  return stateAbbreviations[abbreviation.toUpperCase()];
};
/* export const getQuote = async (queryClient: QueryClient, symbol: string) => {
  return console.log("lol sorry no api calls for you");
}; */
/* export const fetchQuoteWithRetry = async (symbol, retryCount = 3) => {
  try {
    console.log("sorry");
    return;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount > 0) {
      // Retry with backoff after waiting for a certain time
      /*    const waitTime = Math.pow(2, 4 - retryCount) * 1000; // exponential backoff
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return fetchQuoteWithRetry(symbol, retryCount - 1); */
/*    } else {
      // Handle other errors or propagate if no retries left
      throw error;
    }
  }
}; */
export const getPreviousClose = async (
  queryClient: QueryClient,
  symbol: string
): Promise<previousClose | null> => {
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
    params: { symbol, region: "US" },
    headers: {
      "X-RapidAPI-Key": `${YH_KEY3}`,
      "X-RapidAPI-Host": `${YH_URL}`,
    },
  };

  try {
    // Try to get cached data
    const cachedQuote = queryClient.getQueryData(["prevClose", symbol]);

    if (cachedQuote) {
      const newCachedQuote = utils.checkCachedQuoteType(cachedQuote);
      console.log("quoteUtils.ts - got cached prevClose:", cachedQuote);
      return newCachedQuote;
    }

    // If not cached, make an API call
    console.log("quoteUtils.ts - new api request -prevClose ", symbol);
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
    const response = await axios.request(options);

    if (!response.data.quoteType || !response.data.price) {
      throw new Error("Incomplete or missing data in the API response");
    }

    const temp = response.data.quoteType.symbol;
    const quoteData: previousClose = {
      symbol: temp.toLowerCase(),
      previousClose: response.data.price.regularMarketPreviousClose.raw ?? "",
      name: response.data.price.shortName ?? "",
    };
    //
    // Cache the quote data
    queryClient.setQueryData(["prevClose", symbol], quoteData);
    console.log(quoteData);
    return quoteData;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getQuote = async (
  queryClient: QueryClient,
  symbol: string
): Promise<quoteType | null> => {
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
    params: { symbol, region: "US" },
    headers: {
      "X-RapidAPI-Key": `${YH_KEY3}`,
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
      price: response.data.price.regularMarketPrice.raw ?? "",
      name: response.data.price.shortName ?? "",
      priceChange: response.data.price.regularMarketChange.fmt ?? "",
      percentChange: response.data.price.regularMarketChangePercent.raw ?? "",
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
};
export const getQuotePageData = async (
  queryClient: QueryClient,
  symbol: string
): Promise<QuotePageData | null> => {
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
    params: { symbol, region: "US" },
    headers: {
      "X-RapidAPI-Key": `${YH_KEY3}`,
      "X-RapidAPI-Host": `${YH_URL}`,
    },
  };

  try {
    // Try to get cached data
    const cachedQuote = queryClient.getQueryData(["quotePageData", symbol]);

    if (cachedQuote) {
      /*      const newCachedQuote = utils.checkCachedQuoteType(cachedQuote); */
      console.log("quoteUtils.ts - got cached quotePageData:", cachedQuote);
      return cachedQuote;
    }

    // If not cached, make an API call
    console.log("quoteUtils.ts quotePageData - new api request -", symbol);
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
    const response = await axios.request(options);

    if (!response.data.quoteType || !response.data.price) {
      throw new Error("Incomplete or missing data in the API response");
    }

    const temp = response.data.quoteType.symbol;
    const quoteData: quoteType = {
      symbol: temp.toLowerCase(),
      price: response.data.price.regularMarketPrice.raw ?? "",
      name: response.data.price.shortName ?? "",
      priceChange: response.data.price.regularMarketChange.fmt ?? "",
      percentChange: response.data.price.regularMarketChangePercent.raw ?? "",
    };
    const quoteSidebarData: QuotePageSidebarData = {
      previousClose:
        "$" + (response.data.price.regularMarketPreviousClose.fmt ?? ""),
      dayRange:
        "$" +
        (response.data.price.regularMarketDayLow.fmt ?? "") +
        " - $" +
        (response.data.price.regularMarketDayHigh.fmt ?? ""),
      fiftyTwoWeekHigh: response.data.summaryDetail.fiftyTwoWeekHigh.fmt ?? "",
      marketCap: response.data.summaryDetail.marketCap.fmt ?? "",
      avgVolume: response.data.price.averageDailyVolume3Month.fmt ?? "",
      trailingPE: response.data.summaryDetail.trailingPE.fmt ?? "",
      dividendYield: response.data.summaryDetail.dividendYield.fmt ?? "",
      primaryExchange: response.data.price.exchangeName ?? "",
    };
    const quoteSidebarAboutData: QuotePageSidebarAboutData = {
      summary: response.data.summaryProfile.longBusinessSummary ?? "",
      website: response.data.summaryProfile.website ?? "",
      headquarters: `${
        response.data.summaryProfile.city || ""
      }, ${getStateFullName(response.data.summaryProfile.state ?? "NC")} ${
        response.data.summaryProfile.country || ""
      }`,
      employees: response.data.summaryProfile.fullTimeEmployees ?? "",
    };
    /*     console.log(
      response.data.summaryProfile.state,
      response.data.summaryProfile.country,
      getStateFullName(response.data.summaryProfile.state)
    );
    console.log(getStateFullName(response.data.summaryProfile.state ?? "NC")); */
    const quoteFinancialData: QuotePageFinancialData = {
      annualRevenue: response.data.financialData.totalRevenue.fmt ?? "",
      netIncome: response.data.defaultKeyStatistics.netIncomeToCommon.fmt ?? "",
      netProfitMargin: response.data.financialData.profitMargins.fmt ?? "",
      ebitda: response.data.financialData.ebitda.fmt ?? "",
    };
    //
    // Cache the quote data
    const quotePageData: QuotePageData = {
      quoteData,
      quoteSidebarData,
      quoteSidebarAboutData,
      quoteFinancialData,
    };
    queryClient.setQueryData(["quotePageData", symbol], quotePageData);
    console.log(quotePageData);
    return quotePageData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

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

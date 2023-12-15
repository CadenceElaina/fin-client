import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { quoteType, utils } from "./types";
import { YH_KEY1, YH_URL1 } from "../../constants";

const getQuote = async (
  queryClient: QueryClient,
  symbol: string
): Promise<quoteType | null> => {
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
    params: { symbol, region: "US" },
    headers: {
      "X-RapidAPI-Key": `${YH_KEY1}`,
      "X-RapidAPI-Host": `${YH_URL1}`,
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

    // Cache the quote data
    queryClient.setQueryData(["quote", symbol], quoteData);

    return quoteData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getQuote;

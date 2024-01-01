export interface suggestionType {
  inputValue?: string;
  symbol: string;
  name?: string;
  type: string;
  region: string;
  currency: string;
  matchScore?: number; // rank by match score?
}
export interface quoteBasic {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
}
export interface previousClose {
  symbol: string;
  name: string;
  previousClose?: number;
}
export interface quoteType extends previousClose {
  price: number;
  quantity?: number;
  priceChange: number;
  percentChange: number;
}
export interface QuotePageSidebarData {
  previousClose: string;
  dayRange: string;
  fiftyTwoWeekHigh: string;
  marketCap: string;
  avgVolume: string;
  trailingPE: string;
  dividendYield: string;
  primaryExchange: string;
}
export interface QuotePageSidebarAboutData {
  summary: string;
  website: string;
  headquarters: string;
  employees: string;
}
export interface QuotePageFinancialData {
  annualRevenue: string;
  netIncome: string;
  netProfitMargin: string;
  ebitda: string;
}
export type QuotePageData = {
  quoteData: quoteType;
  quoteSidebarData: QuotePageSidebarData;
  quoteSidebarAboutData: QuotePageSidebarAboutData;
  quoteFinancialData: QuotePageFinancialData;
};
const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (value: unknown): string => {
  /*   console.log("ran", value); */
  if (!value || !isString(value)) {
    /*     console.log(value, typeof value); */
    throw new Error(`Incorrect or missing string`);
  }
  return value;
};

const removeNumbersSpacesBeforeCapitalized = (inputString: string): string => {
  return inputString.replace(/^[0-9\s]+(?=[A-Z])/, "");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanseData = (matches: any) => {
  /*    console.log(matches); */
  const sugg: suggestionType[] = matches.map(
    (match: suggestionType) => match as suggestionType
  );
  const cleansedData: suggestionType[] = [];

  for (const s of sugg) {
    if (!s || typeof s !== "object") {
      console.log("Incorrect or missing data");
    }

    if (
      "1. symbol" in s &&
      "2. name" in s &&
      "3. type" in s &&
      "4. region" in s &&
      "8. currency" in s
    ) {
      /*       console.log(s["2. name"]); */

      const symbol: string = parseString(s["1. symbol"]);
      const name: string = parseString(s["2. name"]);
      const type: string = parseString(s["3. type"]);
      const region: string = parseString(s["4. region"]);
      const currency: string = parseString(s["8. currency"]);
      const newSugg: suggestionType = {
        symbol: removeNumbersSpacesBeforeCapitalized(symbol),
        name: removeNumbersSpacesBeforeCapitalized(name),
        type: removeNumbersSpacesBeforeCapitalized(type),
        region: removeNumbersSpacesBeforeCapitalized(region),
        currency: removeNumbersSpacesBeforeCapitalized(currency),
      };

      cleansedData.push(newSugg);
    }
  }

  /*     console.log(cleansedData); */
  return cleansedData;
};

const isQuoteType = (obj: unknown): obj is quoteType => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "symbol" in obj &&
    "name" in obj &&
    "price" in obj &&
    "priceChange" in obj &&
    "percentChange" in obj
  );
};

const checkCachedQuoteType = (cachedQuote: unknown): quoteType => {
  if (isQuoteType(cachedQuote)) {
    // Now TypeScript knows that cachedQuote is of type QuoteType
    return cachedQuote;
  } else {
    // Return a default or empty object if cachedQuote is not of type QuoteType
    return { symbol: "", name: "", price: 0, priceChange: 0, percentChange: 0 };
  }
};

const getSymbols = (data: suggestionType[]): string[] => {
  console.log(data.map((item) => item.symbol));
  return data.map((item) => item.symbol);
};

const getRegions = (data: suggestionType[]): string[] => {
  console.log(data.map((item) => item.region));
  return data.map((item) => item.region);
};

const isQuotesArrayType = (arr: unknown[]): arr is quoteType[] => {
  return Array.isArray(arr) && arr.every(isQuoteType);
};

const checkCachedQuotesType = (cachedQuotes: unknown[]): quoteType[] => {
  if (isQuotesArrayType(cachedQuotes)) {
    // Now TypeScript knows that cachedQuotes is an array of QuoteType
    return cachedQuotes;
  } else {
    // Return an empty array if cachedQuotes is not an array of QuoteType
    return [];
  }
};

const isSuggestionType = (obj: unknown): obj is suggestionType => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "symbol" in obj &&
    "name" in obj &&
    "type" in obj &&
    "region" in obj &&
    "currency" in obj
  );
};

const checkCachedSuggestionType = (cachedData: unknown): suggestionType[] => {
  console.log("");
  console.log(cachedData);
  if (Array.isArray(cachedData)) {
    // If it's an array, check each element
    const filteredArray = cachedData.filter((item) => isSuggestionType(item));
    console.log(filteredArray);
    return filteredArray;
  } else if (isSuggestionType(cachedData)) {
    // If it's a single object, return it in an array
    console.log(cachedData, "\n", [cachedData]);
    return [cachedData];
  } else {
    // Return an empty array if cachedData is not of type SuggestionType
    console.log("returned empty array checkCachedSuggestionType", cachedData);
    return [];
  }
};

export default cleanseData;
export const utils = {
  isString,
  parseString,
  removeNumbersSpacesBeforeCapitalized,
  cleanseData,
  checkCachedQuoteType,
  checkCachedSuggestionType,
  checkCachedQuotesType,
  getSymbols,
  getRegions,
};

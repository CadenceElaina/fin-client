import { quoteType } from "../search/types";
export type TransformedDataType = {
  id: string; // Assuming 'symbol' is a string
  symbol: string;
  name: string;
  price: number;
  priceChange: number; // You might want to change this to number depending on your needs
  percentChange: number;
  // Other properties...
};

export const transformQuotesToData = (
  quotes: Record<string, quoteType | null>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): TransformedDataType[] => {
  return Object.entries(quotes).map(([symbol, quote]) => {
    const percentChange = (quote?.percentChange || 0) * 100; // Convert to percentage
    return {
      // Generate a unique id,
      id: symbol,
      symbol,
      name: quote?.name || "",
      price: quote?.price || 0,
      priceChange: quote?.priceChange || 0,
      percentChange: percentChange.toFixed(2),
    };
  });
};

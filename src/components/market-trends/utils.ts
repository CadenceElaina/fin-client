import { quoteType } from "../search/types";
export type Data = {
  id: number; // Assuming 'symbol' is a string
  symbol: string;
  name: string;
  price: number;
  priceChange: number; // You might want to change this to number depending on your needs
  percentChange: number;
  // Other properties...
};

export const transformQuotesToData = (
  quotes: Record<string, quoteType | null>
): Data[] => {
  return Object.entries(quotes).map(([symbol, quote], i) => {
    const percentChange = (quote?.percentChange || 0) * 100; // Convert to percentage
    return {
      id: i + 1,
      symbol,
      name: quote?.name || "",
      price: quote?.price || 0,
      priceChange: quote?.priceChange || 0,
      percentChange: parseFloat(percentChange.toFixed(2)),
    };
  });
};

import { IconType } from "react-icons";

export enum exchange {
  US = "US",
  Europe = "Europe",
  Asia = "Asia",
  Currencies = "Currencies",
  Crypto = "Crypto",
}
export interface IndexCard {
  icon: IconType;
  exchange: string;
  name: string;
  symbol: string;
  percentChange: number;
  price: number;
  priceChange: number;
}

export interface IndexCardProps {
  cards: IndexCard[];
  currExchance: exchange;
}

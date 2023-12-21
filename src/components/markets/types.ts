export enum exchange {
  US = "US",
  Europe = "Europe",
  Asia = "Asia",
  Currencies = "Currencies",
  Crypto = "Crypto",
}

export interface IndexCard {
  exchange: exchange;
  name: string;
  symbol: string;
  percentChange: number;
  price: number;
  priceChange: number;
}

export interface IndexCardProps {
  cards: IndexCard[];
  currExchange: exchange;
}

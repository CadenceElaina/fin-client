import React from "react";
import Table from "./watchlist/Table";

const data = [
  {
    id: 1,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
    article:
      "https://www.bloomberg.com/news/articles/2023-12-06/citi-cfo-sees-trading-revenue-dropping-as-much-as-20-in-quarter",
  },
  {
    id: 1,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: -4.4,
    percentChange: -2.3,
  },
  {
    id: 1,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 1,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
    article:
      "https://www.bloomberg.com/news/articles/2023-12-06/citi-cfo-sees-trading-revenue-dropping-as-much-as-20-in-quarter",
  },
  {
    id: 1,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
];

const MarketTrendsList = () => {
  return (
    <div className="market-trends-list">
      <Table data={data} full={true} news={true} />
    </div>
  );
};

export default MarketTrendsList;

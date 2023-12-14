import React from "react";
import Table from "./table/Table";
import { RowConfig } from "./table/types";

const data = [
  {
    id: 123,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
    article: {
      title:
        "https://www.bloomberg.com/news/articles/2023-12-06/citi-cfo-sees-trading-revenue-dropping-as-much-as-20-in-quarter",
      source: "MSN",
      time: "2 hours ago",
    },
  },
  {
    id: 234,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: -4.4,
    percentChange: -2.3,
  },
  {
    id: 345,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 456,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
    article: {
      title:
        "https://www.bloomberg.com/news/articles/2023-12-06/citi-cfo-sees-trading-revenue-dropping-as-much-as-20-in-quarter",
      source: "Bloomberg",
      time: "4 hours ago",
    },
  },
  {
    id: 567,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
];

const MarketTrendsList = () => {
  const marketTrendsConfig: RowConfig = {
    fields: ["symbol", "name", "article", "price", "percentChange"],
    addIcon: true,
    name: "market-trends",
  };

  return (
    <div className="market-trends-list">
      <Table data={data} config={marketTrendsConfig} full={true} />
    </div>
  );
};

export default MarketTrendsList;

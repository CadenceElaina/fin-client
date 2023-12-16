import React from "react";
import MarketTrendsButtons from "./MarketTrendsButtons";
import Layout from "../layout/Layout";
import Footer from "../Footer";
import { RowConfig } from "../table/types";
import Table from "../table/Table";
import SidebarNews from "./SidebarNews";
import "./MarketTrends.css";
const data = [
  {
    id: 10,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 20,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: -4.4,
    percentChange: -2.3,
  },
  {
    id: 30,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 40,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 50,
    symbol: "SPY",
    name: "SP 500 ETF",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
];
const Losers = () => {
  const exploreConfig: RowConfig = {
    fields: ["symbol", "name", "price", "priceChange", "percentChange"],
    addIcon: true,
  };
  return (
    <Layout>
      <div role="heading" className="explore-heading">
        Explore market trends
      </div>
      <div>
        <MarketTrendsButtons />
      </div>
      <div className="explore-main-content">
        <Table data={data} config={exploreConfig} full={true} />
        <SidebarNews />
      </div>
      <Footer />
    </Layout>
  );
};

export default Losers;

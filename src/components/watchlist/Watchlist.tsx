import React from "react";
import Table from "./Table";
import "./Watchlist.css";

// symbol name price change in price & %
// sort by
// add investment button -> modal
// create new portfolio component
// related to your watchlist component
// Your watchlist in the news comp
// Discover more comp

const data = [
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

const Watchlist = () => {
  return (
    <div className="table-container">
      {" "}
      <Table data={data} />
    </div>
  );
};

export default Watchlist;

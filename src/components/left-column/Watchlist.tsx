import React from "react";
import Table from "../table/Table";
import "../../App.css";
import { RowConfig } from "../table/types";

// symbol name price change in price & %
// sort by
// add investment button -> modal
// create new portfolio component
// related to your watchlist component
// Your watchlist in the news comp
// Discover more comp

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

const Watchlist = () => {
  const watchlistConfig: RowConfig = {
    fields: ["symbol", "name", "price", "priceChange", "percentChange"],
    addIcon: true,
  };
  return (
    <div className="table-container">
      {" "}
      <div role="heading" className="watchlist-heading">
        Top movers in your list
      </div>
      <Table data={data} config={watchlistConfig} full={true} />
    </div>
  );
};

export default Watchlist;

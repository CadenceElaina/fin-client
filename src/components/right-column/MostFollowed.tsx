import React from "react";
import Table from "../watchlist/Table";
import "./right.css";
import { RowConfig } from "../../types/types";

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
    symbol: "MSFT",
    name: "Microsoft",
    price: 360,
    priceChange: -1.4,
    percentChange: -0.7,
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

const MostFollowed = () => {
  const mostFollowedConfig: RowConfig = {
    fields: ["symbol", "name", "percentChange"],
    addIcon: true,
  };
  return (
    <div className="most-followed-container">
      <div role="heading" className="most-followed-heading">
        Most followed on Finhub
      </div>
      <div>
        <Table data={data} config={mostFollowedConfig} full={true} />
      </div>
    </div>
  );
};

export default MostFollowed;

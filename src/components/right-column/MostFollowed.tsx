import React from "react";
import Table from "../table/Table";
import "./Right.css";
import { RowConfig } from "../table/types";

const data = [
  {
    id: 100,
    symbol: "SPY",
    name: "SP 500 ETF",
    followers: "3.71M",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 200,
    symbol: "MSFT",
    name: "Microsoft",
    followers: "2.16M",
    price: 360,
    priceChange: -1.4,
    percentChange: -0.7,
  },
  {
    id: 300,
    symbol: "SPY",
    name: "SP 500 ETF",
    followers: "4.56M",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
];

const MostFollowed = () => {
  const mostFollowedConfig: RowConfig = {
    fields: ["symbol", "name", "percentChange"],
    addIcon: true,
    name: "most-followed",
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

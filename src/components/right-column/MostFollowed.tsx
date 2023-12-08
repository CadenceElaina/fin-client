import React from "react";
import Table from "../watchlist/Table";
import "./right.css";

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
  return (
    <div className="most-followed-container">
      <div role="heading" className="most-followed-heading">
        Most followed on Finhub
      </div>
      <div>
        <Table data={data} full={true} news={false} />
      </div>
    </div>
  );
};

export default MostFollowed;

import React, { useState } from "react";
import { exchange } from "./types";
import IndexCards from "./IndexCards";
import "./Markets.css";
import { Link } from "react-router-dom";

const Markets = () => {
  //const currExchance = exchange.US;
  const [currExchange, setCurrExchange] = useState(exchange.US);

  const indexesData = [
    {
      exchange: exchange.US,
      name: "Mircrosoft",
      symbol: "msft",
      percentChange: 1.0,
      price: 3000,
      priceChange: 300.0,
    },
    {
      exchange: exchange.US,
      name: "Booking Holdings Inc.",
      symbol: "asdfa",
      percentChange: 1.0,
      price: 3000,
      priceChange: 300.0,
    },
    {
      exchange: exchange.Europe,
      name: "DAX",
      symbol: "DAX",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      exchange: exchange.Asia,
      name: "Nikkei",
      symbol: "Nikkei",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      exchange: exchange.Currencies,
      name: "EUR/USD",
      symbol: "EUR/USD",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      exchange: exchange.Crypto,
      name: "Bitcoin",
      symbol: "Bitcoin",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      exchange: exchange.US,
      name: "Apple",
      symbol: "AAPL",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
  ];

  return (
    <>
      <div className="markets-container">
        <div className="compare-markets">Compare Markets - </div>
        <div className="exchange-chips">
          {Object.values(exchange).map((exchangeType) => (
            <div
              key={exchangeType}
              className={`chip ${
                currExchange === exchangeType ? "active" : ""
              }`}
              onClick={() => setCurrExchange(exchangeType)}
            >
              {exchangeType}
            </div>
          ))}
        </div>{" "}
        <div className="markets-article-link">
          <Link to={"/"} className="linkToArticle">
            Link to Article
          </Link>
        </div>
      </div>

      <IndexCards cards={indexesData} currExchange={currExchange} />
    </>
  );
};

export default Markets;

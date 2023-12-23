import React, { useState } from "react";
import { exchange } from "./types";
import IndexCards from "./IndexCards";
import "./Markets.css";
import { Link } from "react-router-dom";
import { useNews } from "../../context/NewsContext";

const Markets = () => {
  //const currExchance = exchange.US;
  const [currExchange, setCurrExchange] = useState(exchange.US);
  const newsData = useNews();

  // Generate 9 random articles
  const numRandomArticles = 1;
  const randomIndexes = Array.from(
    { length: Math.min(numRandomArticles, newsData.length) },
    () => Math.floor(Math.random() * newsData.length)
  );

  // Get the selected random articles from newsData
  const randomArticles = randomIndexes.map((index) => newsData[index]);
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
  // console.log("article", randomArticles);
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
        <div className="markets-article">
          <div className="markets-article-link">
            <Link
              to={`${randomArticles[0]?.link ?? ""}`}
              className="linkToArticle"
            >
              {`${randomArticles[0]?.title ?? ""}`}
            </Link>
          </div>
          <div className="markets-article-source">
            {`${randomArticles[0]?.source ?? ""}`}{" "}
            {`${randomArticles[0]?.time ?? ""}`}
          </div>
        </div>
      </div>

      <IndexCards cards={indexesData} currExchange={currExchange} />
    </>
  );
};

export default Markets;

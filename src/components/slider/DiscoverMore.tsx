import React, { useEffect, useState } from "react";
import { Data } from "./types";
import "./DiscoverMore.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useIndexQuotes } from "../../context/IndexQuotesContext";
import { useQueryClient } from "@tanstack/react-query";
import { getQuote } from "../search/quoteUtils";
import { quoteBasic, quoteType, utils } from "../search/types";

/* const symbols = [
  "GOOGL",
  "AMZN",
  "MSFT",
  "META",
  "BABA",
  "DIS",
  "V",
  "AAPL",
  "BAC",
  "MCD",
  "WMT",
]; */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NextArrow: React.FC<any> = (props) => (
  <div className="arrow next" onClick={props.onClick}>
    <FaChevronRight />
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrevArrow: React.FC<any> = (props) => (
  <div className="arrow prev" onClick={props.onClick}>
    <FaChevronLeft />
  </div>
);

const DiscoverMore: React.FC = () => {
  const { indexQuotesData, setIndexQuotesData } = useIndexQuotes();
  const settings = {
    dots: false,
    infinite: false,
    swipeToSlide: true,
    speed: 500,

    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  /*   const queryClient = useQueryClient();
  const [symbolQuotes, setSymbolQuotes] = useState<
    Record<string, quoteType | null>
  >({});

  const fetchSymbolQuotes = async () => {
    const quotePromises = symbols.map(async (symbol) => {
      // Check the cache first
      const cachedQuote = queryClient.getQueryData(["quote", symbol]);

      if (cachedQuote) {
        const newCachedQuote = utils.checkCachedQuoteType(cachedQuote);
        console.log("quoteUtils.ts - got cached quote:", cachedQuote);
        return newCachedQuote;
      }

      // If not in the cache, make an API call
    // console.log("quoteUtils.ts - new api request -", symbol); 
      const quoteData = await getQuote(queryClient, symbol);
      await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms delay
      // Update the cache
      queryClient.setQueryData(["quote", symbol], quoteData);

      return quoteData;
    }); */
  /* 
    const quotes = await Promise.all(quotePromises);

    const symbolQuoteMap: Record<string, quoteType | null> = {};
    symbols.forEach((symbol, index) => {
      if (quotes[index]) {
        symbolQuoteMap[symbol] = quotes[index];
      }
    });

    setSymbolQuotes(symbolQuoteMap);
  };

   useEffect(() => {
    fetchSymbolQuotes();
  }, [symbols, queryClient]); 
  console.log(symbolQuotes); */

  return (
    <div className="discover-container">
      <div role="heading" className="discover-heading">
        Discover more
      </div>
      <div role="heading" className="discover-subheading">
        You may be interested in
      </div>
      {indexQuotesData.length > 0 && (
        <Slider {...settings} className="slider-container">
          {Object.entries(indexQuotesData).map(([symbol, security]) => (
            <div key={symbol} className="card">
              {security && (
                <Link to={`/quote/${security.symbol}`}>
                  <div className="card-content">
                    <div>{security.symbol}</div>
                    <div>{security.name}</div>
                    <div>{security.price}</div>
                    <div>{security.percentChange}</div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default DiscoverMore;

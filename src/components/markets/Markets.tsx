import React, { useState } from "react";
import IndexCards from "./IndexCards";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { Grid, Chip, Stack } from "@mui/material";
import "./Markets.css";
import { exchange } from "./types";

const chipStyles = {
  common: {
    cursor: "pointer",
    marginRight: "8px",
    borderRadius: "12px",
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: 500,
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    transition: "background-color 0.3s ease, color 0.3s ease",
  },

  hover: {
    backgroundColor: "rgba(28, 116, 233, 0.1)",
    color: "rgb(24, 90, 188)",
  },
};
const Markets = () => {
  const data = 1;
  //const currExchance = exchange.US;
  const [currExchance, setCurrExchance] = useState(exchange.US);
  const getChipStyles = (exchangeType: exchange) => ({
    cursor: "pointer",
    marginRight: "8px",
    borderRadius: "12px",
    padding: "2px 8px",
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.25rem",
    letterSpacing: "0.0178571429em",
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    transition: "background-color 0.3s ease",
    backgroundColor:
      currExchance === exchangeType ? "rgb(24, 90, 188)" : "inherit",
    color: currExchance === exchangeType ? "inherit" : "inherit",
  });

  const indexesData = [
    {
      icon: data > 0 ? FaArrowUp : FaArrowDown,
      exchange: "US",
      name: "Mircrosoft",
      symbol: "msft",
      percentChange: 1.0,
      price: 3000,
      priceChange: 300.0,
    },
    {
      icon: data > 0 ? FaArrowUp : FaArrowDown,
      exchange: "US",
      name: "Booking Holdings Inc.",
      symbol: "asdfa",
      percentChange: 1.0,
      price: 3000,
      priceChange: 300.0,
    },
    {
      icon: data > 0 ? FaArrowUp : FaArrowDown,
      exchange: "Europe",
      name: "DAX",
      symbol: "DAX",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      icon: data > 0 ? FaArrowUp : FaArrowDown,
      exchange: "Asia",
      name: "Nikkei",
      symbol: "Nikkei",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      icon: data > 0 ? FaArrowUp : FaArrowDown,
      exchange: "Currencies",
      name: "EUR/USD",
      symbol: "EUR/USD",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      icon: data > 0 ? FaArrowUp : FaArrowDown,
      exchange: "Crypto",
      name: "Bitcoin",
      symbol: "Bitcoin",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
    {
      icon: data > 0 ? FaArrowUp : FaArrowDown,
      exchange: "US",
      name: "Apple",
      symbol: "AAPL",
      percentChange: 1.0,
      price: 300,
      priceChange: 3.0,
    },
  ];

  /*   const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(e.target);
    // setCurrExchance(e.target)
  }; */

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <div className="compareMarkets">Compare Markets - </div>
        <div className="divider"></div>
        <Stack direction="row" spacing={1}>
          {Object.values(exchange).map((exchangeType) => (
            <Chip
              key={exchangeType}
              label={exchangeType}
              variant="outlined"
              sx={{
                ...getChipStyles(exchangeType),
                "&:hover": chipStyles.hover,
              }}
              onClick={() => setCurrExchance(exchangeType)}
            />
          ))}
        </Stack>{" "}
        <div className="divider"></div>-{" "}
        <a href="#your-article-link" className="linkToArticle">
          Link to Article
        </a>
      </Grid>
      <div style={{ marginTop: "20px" }}>
        <IndexCards cards={indexesData} currExchance={currExchance} />
      </div>
    </>
  );
};

export default Markets;

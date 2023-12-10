import React from "react";
import CustomButton from "../CustomButton";
import "./Right.css";

const MarketTrends = () => {
  return (
    <div className="market-trends-container">
      <div className="market-trends-header" role="heading">
        Market Trends
      </div>

      <div className="market-trends-buttons">
        <CustomButton
          label="Market Indexes"
          secondary
          onClick={() => console.log("Market Indexes")}
        />
        <CustomButton
          label="Most Active"
          secondary
          onClick={() => console.log("Most Active")}
        />
        <CustomButton
          label="Gainers"
          secondary
          onClick={() => console.log("Gainers")}
        />
        <CustomButton
          label="Losers"
          secondary
          onClick={() => console.log("Losers")}
        />
        <CustomButton
          label="Climate Leaders"
          secondary
          onClick={() => console.log("Climate Leaders")}
        />
        <CustomButton
          label="Crypto"
          secondary
          onClick={() => console.log("Crypto")}
        />
        <CustomButton
          label="Currencies"
          secondary
          onClick={() => console.log("Currencies")}
        />
      </div>
    </div>
  );
};

export default MarketTrends;

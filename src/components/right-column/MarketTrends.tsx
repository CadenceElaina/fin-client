import React from "react";
import CustomButton from "../CustomButton";
import "./Right.css";
import { useNavigate } from "react-router-dom";

const MarketTrends = () => {
  const navigate = useNavigate();
  return (
    <div className="market-trends-container">
      <div className="market-trends-header" role="heading">
        Market Trends
      </div>

      <div className="market-trends-buttons">
        <CustomButton
          label="Market Indexes"
          secondary
          onClick={() => navigate("/market-trends/indexes")}
        />
        <CustomButton
          label="Most Active"
          secondary
          onClick={() => navigate("/market-trends/active")}
        />
        <CustomButton
          label="Gainers"
          secondary
          onClick={() => navigate("/market-trends/gainers")}
        />
        <CustomButton
          label="Losers"
          secondary
          onClick={() => navigate("/market-trends/losers")}
        />
        <CustomButton
          label="Trending"
          secondary
          onClick={() => navigate("/market-trends/trending")}
        />
      </div>
    </div>
  );
};

export default MarketTrends;

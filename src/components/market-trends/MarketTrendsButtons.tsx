import React from "react";
import CustomButton from "../CustomButton";
import { useNavigate, useLocation } from "react-router-dom";
import "./MarketTrends.css";

interface MarketTrendsButtonsProps {}

const MarketTrendsButtons: React.FC<MarketTrendsButtonsProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    // Check if the current path matches the given path
    return currentPath.includes(path);
  };
  return (
    <div className="market-trends-buttons-container">
      <div className="market-trends-buttons">
        <CustomButton
          label="Market Indexes"
          noStyles={true}
          trends={true}
          onClick={() => navigate("/market-trends/indexes")}
          active={isActive("/market-trends/indexes")}
        />
        <CustomButton
          label="Most Active"
          noStyles={true}
          trends={true}
          onClick={() => navigate("/market-trends/active")}
          active={isActive("/market-trends/active")}
        />
        <CustomButton
          label="Gainers"
          noStyles={true}
          trends={true}
          onClick={() => navigate("/market-trends/gainers")}
          active={isActive("/market-trends/gainers")}
        />
        <CustomButton
          label="Losers"
          noStyles={true}
          trends={true}
          onClick={() => navigate("/market-trends/losers")}
          active={isActive("/market-trends/losers")}
        />
        <CustomButton
          label="Climate Leaders"
          noStyles={true}
          trends={true}
          onClick={() => navigate("/market-trends/climate")}
          active={isActive("/market-trends/climate")}
        />
        <CustomButton
          label="Crypto"
          noStyles={true}
          trends={true}
          onClick={() => navigate("/market-trends/crypto")}
          active={isActive("/market-trends/crypto")}
        />
        <CustomButton
          label="Currencies"
          noStyles={true}
          trends={true}
          onClick={() => navigate("/market-trends/currencies")}
          active={isActive("/market-trends/currencies")}
        />
      </div>
    </div>
  );
};

export default MarketTrendsButtons;

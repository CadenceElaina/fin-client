import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import QuoteChart from "../../components/quote-chart/QuoteChart";
import "./Quote.css";

interface QuoteProps {
  symbol?: string;
  price?: number;
  data?: [];
}

const Quote: React.FC<QuoteProps> = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const { searchInput, showDropdown } = location.state || {};

  // State to track the selected time interval
  const [selectedInterval, setSelectedInterval] = useState("1D");

  const handleIntervalChange = (interval: string) => {
    // Set the selected interval and update the chart
    setSelectedInterval(interval);
  };

  return (
    <div>
      <Layout>
        <div>
          {/* Button group for time intervals */}
          <div className="button-group">
            {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map(
              (interval) => (
                <button
                  key={interval}
                  className={selectedInterval === interval ? "active" : ""}
                  onClick={() => handleIntervalChange(interval)}
                >
                  {interval}
                </button>
              )
            )}
          </div>

          {/* Chart component with the selected interval */}
          <QuoteChart interval={selectedInterval} />
        </div>
      </Layout>
    </div>
  );
};

export default Quote;

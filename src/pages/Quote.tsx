import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import QuoteChart from "../components/quote-chart/QuoteChart";

interface QuoteProps {
  symbol?: string;
  price?: number;
  data?: [];
}

const Quote: React.FC<QuoteProps> = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const { searchInput, showDropdown } = location.state || {};
  console.log(searchInput, showDropdown);
  return (
    <div>
      <Layout>
        <div>
          Stock {symbol} Price Data
          <QuoteChart />
        </div>
      </Layout>
    </div>
  );
};

export default Quote;

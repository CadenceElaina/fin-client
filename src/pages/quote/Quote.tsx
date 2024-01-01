import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import QuoteChart from "../../components/quote-chart/QuoteChart";
import "./Quote.css";
import Footer from "../../components/Footer";
import { FaAngleDown, FaAngleRight, FaAngleUp } from "react-icons/fa";
import QuoteNews from "../../components/quote-chart/news/QuoteNews";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { getQuotePageData } from "../../components/search/quoteUtils";
import { IoAddSharp } from "react-icons/io5";
import { CiShare2 } from "react-icons/ci";

interface QuoteProps {
  symbol?: string;
  price?: number;
  data?: [];
}

const Quote: React.FC<QuoteProps> = () => {
  /*   const { symbol } = useParams();
  console.log(symbol); */
  const queryClient = useQueryClient();
  const location = useLocation();
  const { searchInput, showDropdown } = location.state || {};
  const symbol = location.pathname.split("/").pop();
  console.log(symbol);
  // State to track the selected time interval
  const [selectedInterval, setSelectedInterval] = useState("1D");
  const [isAboutOpen, setIsAboutOpen] = useState(true);

  const handleAboutToggle = () => {
    setIsAboutOpen(!isAboutOpen);
  };

  const handleIntervalChange = (interval: string) => {
    // Set the selected interval and update the chart
    setSelectedInterval(interval);
  };

  const {
    data: quotePageData,
    isLoading: isQuotePageDataLoading,
    isError: isQuotePageDataError,
  } = useQuery({
    queryKey: ["quotePageData", symbol],
    queryFn: () => getQuotePageData(queryClient, symbol || ""),
    enabled: Boolean(symbol), // Only enable the query when symbol is available
  });
  const quoteData = quotePageData?.quoteData;
  const quoteSidebarData = quotePageData?.quoteSidebarData;
  const quoteSidebarAboutData = quotePageData?.quoteSidebarAboutData;
  const quoteFinancialData = quotePageData?.quoteFinancialData;
  console.log(
    quoteData,
    quoteSidebarData,
    quoteSidebarAboutData,
    quoteFinancialData
  );

  return (
    <div>
      <Layout>
        <div className="quote-top-container">
          <div className="quote-links">
            <Link to={"/"}>HOME</Link>
            <FaAngleRight className="quote-arrow" />
            <div>{symbol}</div>
            <div className="quote-links-item"> • </div>
            <div className="quote-primary-exchange">
              {quoteSidebarData?.primaryExchange}
            </div>
          </div>
          <div role="heading" className="quote-name">
            {quoteData?.name}
          </div>
        </div>
        <div className="quote-container">
          <div className="quote-main-column">
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
            <QuoteChart interval={selectedInterval} symbol={symbol || ""} />
            <div className="quote-news">
              {" "}
              <QuoteNews />
            </div>
            <div className="quote-financials">
              <div role="heading">Financials</div>
              <div className="quote-financials-income">
                <div role="heading">Income Statement</div>
                <div className="quote-financials-row">
                  <span>Revenue</span>
                  <span>{quoteFinancialData?.annualRevenue}</span>
                </div>
                <div className="quote-financials-row">
                  <span>Net income</span>
                  <span>{quoteFinancialData?.netIncome}</span>
                </div>
                <div className="quote-financials-row">
                  <span>Net profit margin</span>
                  <span>{quoteFinancialData?.netProfitMargin}</span>
                </div>
                <div className="quote-financials-row">
                  <span>EBITDA</span>
                  <span>{quoteFinancialData?.ebitda}</span>
                </div>
              </div>
              <div className="quote-financials-balance">
                <div role="heading">Balance Sheet</div>
              </div>
              <div className="quote-financials-cash">
                <div role="heading">Cash Flow</div>
              </div>
            </div>
          </div>
          <div className="quote-side-column">
            <div className="quote-right-info">
              <div className="quote-data-list">
                <div className="quote-data-buttons">
                  <button>
                    <span>
                      <IoAddSharp style={{ color: "#1a73e8" }} />
                    </span>
                    <span>Follow</span>
                  </button>
                  <button>
                    <span>
                      <CiShare2 />
                    </span>
                    <span>Share</span>
                  </button>
                </div>
                {Object.entries(quoteSidebarData || {}).map(([key, value]) => (
                  <div key={key} className="quote-data-row">
                    <div>{key}</div>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
              <div className={`quote-about ${isAboutOpen ? "open" : "closed"}`}>
                <div
                  role="heading"
                  onClick={handleAboutToggle}
                  className="about-heading"
                >
                  <span>About</span>
                  <span>{isAboutOpen ? <FaAngleUp /> : <FaAngleDown />}</span>
                </div>
                {isAboutOpen && (
                  <div className="quote-about-data">
                    <div className="quote-about-text">
                      {quoteSidebarAboutData?.summary}
                    </div>
                    <div className="quote-about-row">
                      <span>CEO</span>
                      <span>Satya Nedella</span>
                    </div>
                    <div className="quote-about-row">
                      <span>FOUNDED</span>
                      <span>Apr 4, 1975</span>
                    </div>
                    {quoteSidebarAboutData &&
                      Object.entries(quoteSidebarAboutData)
                        .filter(([key]) => key !== "summary")
                        .map(([key, value]) => (
                          <div key={key} className="quote-about-row">
                            <span>{key}</span>
                            {key.toLowerCase() === "website" ? (
                              <span>
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {value.replace(
                                    /(https?:\/\/)?(www\.)|(\.\w{2,3}\.\w{2})/g,
                                    ""
                                  )}
                                </a>
                              </span>
                            ) : key.toLowerCase() === "employees" ? (
                              <span>
                                {parseInt(value, 10).toLocaleString()}
                              </span>
                            ) : (
                              <span>{value}</span>
                            )}
                          </div>
                        ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    </div>
  );
};

export default Quote;

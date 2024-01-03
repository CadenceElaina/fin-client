import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import QuoteChart from "../../components/quote-chart/QuoteChart";
import "./Quote.css";
import Footer from "../../components/Footer";
import {
  FaAngleDown,
  FaAngleRight,
  FaAngleUp,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import QuoteNews from "../../components/quote-chart/news/QuoteNews";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { getQuotePageData } from "../../components/search/quoteUtils";
import { IoAddSharp } from "react-icons/io5";
import { CiShare2 } from "react-icons/ci";
import { isHoliday } from "./quoteUtils";

interface QuoteProps {
  symbol?: string;
  price?: number;
  data?: [];
}

const Quote: React.FC<QuoteProps> = () => {
  /*   const { symbol } = useParams();
  console.log(symbol); */
  const [marketStatus, setMarketStatus] = useState<string>("Closed");
  const queryClient = useQueryClient();
  const location = useLocation();
  const { searchInput, showDropdown } = location.state || {};
  const { state } = location;
  const symbol = state[1] ? `${state[1]}` : "";

  const symbolState = state[1] || "";
  let symbolForChart = "";
  switch (symbolState) {
    case "^DJI":
      symbolForChart = "DJI";
      break;
    case "^GSPC":
      symbolForChart = "SP500";
      break;
    case "^IXIC":
      symbolForChart = "COMP.IND";
      break;
    case "^RUT":
      symbolForChart = "IWM";
      break;
    case "^VIX":
      symbolForChart = "VIX";
      break;
    case "^GDAXI":
      symbolForChart = "DAX";
      break;
    case "^FTSE":
      symbolForChart = "UKX";
      break;
    case "^IBEX":
      symbolForChart = "IBEX:IND";
      break;
    case "^N225":
      symbolForChart = "NKY:IND";
      break;
    case "^HSI":
      symbolForChart = "HSI";
      break;
    case "^BSEN":
      symbolForChart = "SENSEX";
      break;
    case "BTC-USD":
      symbolForChart = "BTC-USD";
      break;
    case "ETH-USD":
      symbolForChart = "ETH-USD";
      break;
    case "BAT-USD":
      symbolForChart = "BAT-USD";
      break;
    default:
      console.log("quote.tsx default switch value");
      symbolForChart = "";
  }

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
    queryFn: () =>
      getQuotePageData(queryClient, symbol || "", state[0] || false),
    enabled: Boolean(symbol), // Only enable the query when symbol is available
  });

  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Convert the current time to minutes for easier comparison
      const currentTimeInMinutes = hours * 60 + minutes;

      // Define the trading hours
      const marketOpenTimeInMinutes = 9 * 60 + 30; // 9:30 AM
      const marketCloseTimeInMinutes = 16 * 60; // 4:00 PM
      const afterHoursStartInMinutes = 16 * 60 + 15; // 4:15 PM
      const afterHoursEndInMinutes = 18 * 60 + 30; // 6:30 PM

      // Compare the current time with trading hours
      console.log(now);
      if (isHoliday(now)) {
        setMarketStatus("Closed - Holiday");
      } else {
        if (
          currentTimeInMinutes >= marketOpenTimeInMinutes &&
          currentTimeInMinutes < marketCloseTimeInMinutes
        ) {
          setMarketStatus("Regular Market Hours");
        } else if (
          currentTimeInMinutes >= afterHoursStartInMinutes &&
          currentTimeInMinutes <= afterHoursEndInMinutes
        ) {
          setMarketStatus("After-Hours Trading");
        } else if (currentTimeInMinutes >= marketCloseTimeInMinutes) {
          setMarketStatus("Closed");
        } else {
          setMarketStatus("Pre-Market");
        }
      }
    };

    getCurrentTime();

    // Update market status every hour
    const interval = setInterval(getCurrentTime, 3600000); // Set interval to 1 hour (60 minutes * 60 seconds * 1000 milliseconds)

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const quoteData = quotePageData?.quoteData;
  const quoteSidebarData = quotePageData?.quoteSidebarData;
  const quoteSidebarAboutData = quotePageData?.quoteSidebarAboutData;
  const quoteFinancialData = quotePageData?.quoteFinancialData;
  const keyMappings = {
    previousClose: "PREVIOUS CLOSE",
    dayRange: "DAY RANGE",
    fiftyTwoWeekHigh: "52 WEEK HIGH",
    marketCap: "MARKET CAP",
    average3MonthVolume: "AVG 3M VOLUME",
    trailingPE: "TRAILING PE",
    dividendYield: "DIVIDEND YIELD",
    primaryExchange: "EXCHANGE",
  };
  console.log(
    quoteData,
    quoteSidebarData,
    quoteSidebarAboutData,
    quoteFinancialData
  );

  // If it's a direct link from an index card, update the symbol from the state
  if (state && state[0] === true) {
    // ... (rest of the component remains unchanged)
    console.log(quoteData);
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
              <div className="quote-price-container">
                {/* Price, Percent Change, Price Change, Today/Interval on the same row */}
                <div className="quote-price-changes">
                  <div
                    className={
                      quoteData?.percentChange !== undefined &&
                      quoteData?.percentChange >= 0
                        ? "quote-price-positive"
                        : "quote-price-negative"
                    }
                  >
                    {quoteData?.price}
                  </div>
                  <div
                    className={
                      quoteData?.percentChange !== undefined &&
                      quoteData.percentChange >= 0
                        ? "quote-percent-change-positive"
                        : "quote-percent-change-negative"
                    }
                  >
                    {quoteData?.percentChange !== undefined &&
                    quoteData.percentChange >= 0 ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}

                    {quoteData?.percentChange !== undefined
                      ? `${(quoteData.percentChange * 100).toFixed(2)}%`
                      : ""}
                  </div>
                  <div
                    className={
                      quoteData?.priceChange !== undefined &&
                      quoteData.priceChange >= 0
                        ? "quote-price-change-positive"
                        : "quote-price-change-negative"
                    }
                  >
                    {quoteData?.priceChange !== undefined
                      ? quoteData.priceChange > 0
                        ? `+${quoteData.priceChange}`
                        : quoteData.priceChange
                      : ""}
                  </div>
                  <div
                    className={
                      selectedInterval === "1D" &&
                      quoteData?.percentChange !== undefined &&
                      quoteData.percentChange >= 0
                        ? "quote-price-interval-positive"
                        : "quote-price-interval-negative"
                    }
                  >
                    {selectedInterval === "1D" ? "Today" : selectedInterval}
                  </div>
                </div>

                {/* Market status, exchange, and disclaimer on a separate row */}
                <div className="quote-price-subheading">
                  <div>({marketStatus})</div>{" "}
                  <div className="quote-links-item"> • </div>{" "}
                  <div>{quoteSidebarData?.primaryExchange}</div>{" "}
                  <div>
                    <Link to={"/disclaimer"}>Disclaimer</Link>
                  </div>
                </div>
              </div>

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
              <QuoteChart
                interval={selectedInterval}
                symbol={symbolForChart || ""}
                previousClosePrice={""}
              />
            </div>
          </div>
        </Layout>
      </div>
    );
  }

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
            <div className="quote-price-container">
              {/* Price, Percent Change, Price Change, Today/Interval on the same row */}
              <div className="quote-price-changes">
                <div
                  className={
                    quoteData?.percentChange !== undefined &&
                    quoteData?.percentChange >= 0
                      ? "quote-price-positive"
                      : "quote-price-negative"
                  }
                >
                  {quoteData?.price}
                </div>
                <div
                  className={
                    quoteData?.percentChange !== undefined &&
                    quoteData.percentChange >= 0
                      ? "quote-percent-change-positive"
                      : "quote-percent-change-negative"
                  }
                >
                  {quoteData?.percentChange !== undefined &&
                  quoteData.percentChange >= 0 ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )}

                  {quoteData?.percentChange !== undefined
                    ? `${(quoteData.percentChange * 100).toFixed(2)}%`
                    : ""}
                </div>
                <div
                  className={
                    quoteData?.priceChange !== undefined &&
                    quoteData.priceChange >= 0
                      ? "quote-price-change-positive"
                      : "quote-price-change-negative"
                  }
                >
                  {quoteData?.priceChange !== undefined
                    ? quoteData.priceChange > 0
                      ? `+${quoteData.priceChange}`
                      : quoteData.priceChange
                    : ""}
                </div>
                <div
                  className={
                    selectedInterval === "1D" &&
                    quoteData?.percentChange !== undefined &&
                    quoteData.percentChange >= 0
                      ? "quote-price-interval-positive"
                      : "quote-price-interval-negative"
                  }
                >
                  {selectedInterval === "1D" ? "Today" : selectedInterval}
                </div>
              </div>

              {/* Market status, exchange, and disclaimer on a separate row */}
              <div className="quote-price-subheading">
                <div>({marketStatus})</div>{" "}
                <div className="quote-links-item"> • </div>{" "}
                <div>{quoteSidebarData?.primaryExchange}</div>{" "}
                <div>
                  <Link to={"/disclaimer"}>Disclaimer</Link>
                </div>
              </div>
            </div>

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
            <QuoteChart
              interval={selectedInterval}
              symbol={symbol || ""}
              previousClosePrice={quoteSidebarData?.previousClose}
            />
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
                    {/* Use the mapped key for display */}
                    <div>{keyMappings[key]}</div>
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

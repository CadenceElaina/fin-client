import React, { useEffect, useState } from "react";
import { FaChartBar } from "react-icons/fa";
import { usePortfolios } from "../../../context/PortfoliosContext";
import CustomButton from "../../CustomButton";
import portfolioService from "../../../services/portfolios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import NewPortfolioModal from "../../modals/AddPortfolioModal";
import "./Portfolio.css";
import { Skeleton } from "@mui/material";

import { useQueryClient } from "@tanstack/react-query";
import { quoteType } from "../../search/types";
import { getQuote } from "../../search/quoteUtils";

interface PortfolioSymbols {
  [portfolioTitle: string]: { [symbol: string]: number };
}

const YourPortfolios = () => {
  const { portfolios, appendPortfolio } = usePortfolios();
  const { user } = useAuth();
  const auth = !!user;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const portfolioSymbols: PortfolioSymbols = {};

  // Populate the object with symbols and quantities
  portfolios.forEach((portfolio) => {
    const symbolsWithQuantities =
      portfolio.securities?.reduce((acc, security) => {
        acc[security.symbol] = security.quantity;
        return acc;
      }, {} as { [symbol: string]: number }) || {};

    portfolioSymbols[portfolio.title] = symbolsWithQuantities;
  });

  const queryClient = useQueryClient();
  const [portfolioQuotes, setPortfolioQuotes] = useState<
    Record<
      string,
      {
        symbol: string;
        price: number;
        percentChange: number;
        quantity: number;
      }[]
    >
  >({});
  const [quoteCache, setQuoteCache] = useState<
    Record<string, quoteType | null>
  >({});
  const fetchPortfolioQuotes = async (portfolioTitle: string) => {
    const symbolsWithQuantities = portfolioSymbols[portfolioTitle];

    const quotePromises = Object.entries(symbolsWithQuantities).map(
      async ([symbol, quantity]) => {
        // Check the cache first
        if (quoteCache[symbol]) {
          return {
            symbol,
            price: quoteCache[symbol]?.price || 0,
            percentChange: quoteCache[symbol]?.percentChange || 0,
            quantity,
          };
        }

        // If not in the cache, make an API call
        const quoteData = await getQuote(queryClient, symbol);

        //console.log(`perecnt change of ${symbol}, ${quoteData?.percentChange}`);
        // Update the cache
        setQuoteCache((prevCache) => ({
          ...prevCache,
          [symbol]: quoteData,
        }));

        return {
          symbol,
          price: quoteData?.price || 0,
          percentChange: quoteData?.percentChange || 0,
          quantity,
        };
      }
    );

    const quotes = await Promise.all(quotePromises);

    setPortfolioQuotes((prevQuotes) => ({
      ...prevQuotes,
      [portfolioTitle]: quotes,
    }));
  };

  useEffect(() => {
    // Fetch quotes for each portfolio

    console.log("useEffect triggered YourPortfolios.tsx");
    portfolios.forEach((portfolio) => {
      console.log(`Fetching quotes for portfolio: ${portfolio.title}`);
      fetchPortfolioQuotes(portfolio.title);
      setIsLoading(false);
    });
  }, [portfolios]);
  // [portfolios, quoteCache] - worked previously (because I hadnt reached the api call limit?) - but currently calls infintely
  // ...

  //const symbol = "AAPL"; // Replace with the desired symbol
  //const quoteData = await getQuote(queryClient, symbol);

  /*   console.log(portfolios, portfolioSymbols);
  console.log(user); */
  console.log(portfolioQuotes);
  const openModal = () => {
    if (!auth) {
      navigate("/login");
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSavePortfolio = async (portfolioName: string) => {
    // Handle saving the portfolio data (you can implement this part)
    const newPortfolio = {
      title: portfolioName,
      author: user?.name,
    };
    const response = await portfolioService.create(newPortfolio);
    console.log(response);
    // appendPortfolio to our context state
    appendPortfolio({
      id: response.id,
      title: response.title,
      author: response.author,
    });

    closeModal();
    navigate(`/portfolio/${response.id}`);
  };

  const canCreateNewPortfolio = () => {
    // Check if the user has less than 3 portfolios
    const userPortfolios = portfolios.filter(
      (portfolio) => portfolio.author === user?.name
    );
    // console.log(userPortfolios);
    return userPortfolios.length < 3;
  };

  const Tooltip = () => (
    <div className="tooltip">You may not have more than 3 portfolios</div>
  );
  const totalPortfolioValue = portfolios.reduce((acc, portfolio) => {
    const securities = portfolioQuotes[portfolio.title] || [];
    const portfolioValue = securities.reduce((valueAcc, security) => {
      return valueAcc + security.price * security.quantity;
    }, 0);

    return acc + portfolioValue;
  }, 0);
  console.log(portfolios);
  const usersPortfolios = portfolios.filter((p) => p.author === user?.name);
  return (
    <div className="add-portfolio-container">
      <div className="add-portfolio-header">
        {/* Portfolio/Graph icon */}
        <div className="add-portfolio-icon">
          <FaChartBar size={30} />
        </div>
        <div className="add-portfolio-text">Your portfolios</div>
      </div>
      <div className="portfolio-value">
        {isLoading ? (
          <Skeleton
            variant="text"
            width={100}
            height={20}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />
        ) : totalPortfolioValue ? (
          `$${totalPortfolioValue.toFixed(2)}`
        ) : (
          "$0.00"
        )}
      </div>
      <div className="border-top"></div>
      {usersPortfolios.length > 0 ? (
        <div className="portfolio-list">
          {isLoading ? (
            <>
              <Skeleton
                variant="rounded"
                width={300}
                height={50}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                style={{ marginBottom: "10px" }}
              />
              <Skeleton
                variant="rounded"
                width={300}
                height={50}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                style={{ marginBottom: "10px" }}
              />
              <Skeleton
                variant="rounded"
                width={300}
                height={50}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                style={{ marginBottom: "10px" }}
              />
            </>
          ) : (
            usersPortfolios.map((portfolio) => {
              const securities = portfolioQuotes[portfolio.title] || [];
              const totalValue = securities.reduce((acc, security) => {
                const { quantity, percentChange } = security;
                const securityValueChange = quantity * percentChange;
                return acc + securityValueChange;
              }, 0);

              const totalQuantity = securities.reduce((acc, security) => {
                return acc + security.quantity;
              }, 0);

              const totalPercentChange =
                totalQuantity !== 0 ? (totalValue / totalQuantity) * 100 : 0;

              const portfolioValue = securities.reduce((acc, security) => {
                return acc + security.price * security.quantity;
              }, 0);

              return (
                <div key={portfolio.id} className="portfolio">
                  <div className="portfolio-inner">
                    <Link
                      to={`/portfolio/${portfolio.id}`}
                      style={{ textDecoration: "none", color: "white" }}
                      className="portfolio-link"
                    >
                      <span className="portfolio-label">{portfolio.title}</span>
                      <span className="portfolio-value">
                        {portfolioValue
                          ? `$${portfolioValue.toFixed(2)}`
                          : "$0.00"}
                      </span>
                      <span
                        className={`portfolio-percent-change ${
                          totalPercentChange > 0
                            ? "p-positive"
                            : totalPercentChange < 0
                            ? "p-negative"
                            : ""
                        }`}
                      >
                        {totalPercentChange.toFixed(2)}%
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : null}
      <div className="add-portfolio-button">
        {canCreateNewPortfolio() ? (
          <CustomButton
            label="New Portfolio"
            onClick={openModal}
            fullWidth
            large
          />
        ) : (
          <>
            <CustomButton
              label="New Portfolio"
              onClick={openModal}
              fullWidth
              large
              disabled // Add the disabled attribute here
            />
            <Tooltip />
          </>
        )}
      </div>
      {/* Render the modal conditionally */}
      {isModalOpen && (
        <NewPortfolioModal onCancel={closeModal} onSave={handleSavePortfolio} />
      )}
    </div>
  );
};

export default YourPortfolios;

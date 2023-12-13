import React, { useState } from "react";
import {
  FaList,
  FaChartLine,
  FaPlus,
  FaEllipsisV,
  FaAngleRight,
} from "react-icons/fa";
import Layout from "../layout/Layout";
import "./Portfolio.css";
import { usePortfolios } from "../../context/PortfoliosContext";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<string>("portfolioName");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { portfolios, removePortfolio } = usePortfolios();

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const handleDropdownToggle = () => {
    /*     console.log(showDropdown); */
    setShowDropdown(!showDropdown);
  };

  const handleDropdownOptionClick = async (option: string) => {
    if (option === "remove" && activeTab !== "watchlist") {
      const removedPortfolio = portfolios.find((p) => p.title === activeTab);

      if (removedPortfolio) {
        // Call the removePortfolio function from the context
        removePortfolio(removedPortfolio);
      }
    }

    // Close the dropdown after selecting an option
    setShowDropdown(false);
  };

  /*   console.log("Portfolios:", portfolios); */
  return (
    <Layout>
      <div className="portfolio-container">
        <div className="portfolio-header">
          <div className="portfolio-header-item">
            <a href="/">
              <span className="label">HOME</span>
            </a>
            <FaAngleRight className="arrow1" />
            <span className="label">YOUR LISTS</span>
          </div>
          <div className="portfolio-header-item">
            <div
              className={`tab ${
                activeTab === "watchlist" ? "active-tab" : "inactive-tab"
              }`}
              onClick={() => handleTabClick("watchlist")}
            >
              <div className="tab-inner">
                <FaList size={18} />
                <span className="label">Watchlist</span>
                <span className="count">0</span>
              </div>
            </div>

            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className={`tab ${
                  activeTab === portfolio.title ? "active-tab" : "inactive-tab"
                }`}
                onClick={() => handleTabClick(portfolio.title)}
              >
                <div className="tab-inner">
                  <FaChartLine size={18} />
                  <span className="label">{portfolio.title}</span>
                  <span className="count">0</span>
                </div>
              </div>
            ))}
            <button className="add-list">
              <FaPlus size={18} />
              <span className="label">New list</span>
            </button>
          </div>
        </div>
        <div className="main-container">
          {/*  chart component */}
          <div className="chart">
            <div className="chart-header">
              <span className="portfolio-title">Portfolio title</span>
              <div className="settings-dropdown">
                <button className="settings" onClick={handleDropdownToggle}>
                  <FaEllipsisV size={18} />
                </button>
                {showDropdown && (
                  <div className="dropdown-content">
                    {/* Dropdown options */}
                    <div
                      className="dropdown-option"
                      onClick={() => handleDropdownOptionClick("Option 1")}
                    >
                      Option 1
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => handleDropdownOptionClick("Option 2")}
                    >
                      Option 2
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => handleDropdownOptionClick("remove")}
                    >
                      Remove
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="add-investment">
            <FaPlus size={18} />
            <span className="label">Add investments</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;

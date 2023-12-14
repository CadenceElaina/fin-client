import React, { useEffect, useState } from "react";
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
import AddToPortfolioModal from "../../components/modals/AddToPortfolioModal";
import { useNavigate, useParams } from "react-router-dom";

interface Security {
  symbol: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
}

interface Portfolio {
  id: string;
  title: string;
  author: string | undefined;
  securities?: Security[];
}

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [activePortfolio, setActivePortfolio] = useState<Portfolio>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [addToPortfolioModalIsOpen, setAddToPortfolioModalIsOpen] =
    useState<boolean>(false);
  const { portfolios, removePortfolio, addSecurityToPortfolio } =
    usePortfolios();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Find the portfolio with the matching id and set activePortfolio
    const matchingPortfolio = portfolios.find((p) => p.id === id);
    if (matchingPortfolio) {
      setActivePortfolio(matchingPortfolio);
      setActiveTab(matchingPortfolio.title);
    }
  }, [id, portfolios]);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    navigate(`/portfolio/${tab}`);
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

  const openAddToPortfolioModal = () => {
    setAddToPortfolioModalIsOpen(true);
  };

  const addToPortfolio = async (newSecurity: Security) => {
    //get our addedSecuritites
    /* const addedSecurities = await portfolioService.addToPortfolio(activePortfolio.id, newSecurity)
    setAddToPortfolioModalIsOpen(false); */
    //return addedSecurities;
    if (activePortfolio) {
      // Update the context with the new security
      addSecurityToPortfolio(activePortfolio.id, newSecurity);
    }
  };
  const onClose = () => {
    setAddToPortfolioModalIsOpen(false);
  };
  //console.log(addToPortfolioModalIsOpen);
  console.log(activePortfolio);
  /*   console.log("Portfolios:", portfolios); */
  /*  console.log(portfolios, activeTab, activePortfolio); */
  return (
    <Layout>
      {addToPortfolioModalIsOpen && (
        <AddToPortfolioModal
          isOpen={addToPortfolioModalIsOpen}
          portfolioName={activeTab}
          onClose={onClose} // Close modal function
          onSave={(symbol, quantity, purchaseDate, purchasePrice) => {
            // Handle saving data to your state or API
            // For now, just log the data
            const newSecurity = {
              symbol,
              quantity,
              purchaseDate,
              purchasePrice,
            };
            addToPortfolio(newSecurity);
            /* portfolioService.addToPortfolio(newSecurity) */
            console.log("Symbol:", symbol);
            console.log("Quantity:", quantity);
            console.log("Purchase Date:", purchaseDate);
            console.log("Purchase Price:", purchasePrice);
          }}
        />
      )}
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
                onClick={() => handleTabClick(portfolio.id)}
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
          <button className="add-investment" onClick={openAddToPortfolioModal}>
            <FaPlus size={18} />
            <span className="label">Add investments</span>
          </button>
          <div>
            {activePortfolio?.securities?.map((s) => (
              <div key={s.symbol}>
                {s.symbol}
                {s.quantity}
                {s.purchaseDate}
                {s.purchasePrice}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;

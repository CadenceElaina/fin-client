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
import { Link, useNavigate, useParams } from "react-router-dom";
import Watchlist from "./watchlist/Watchlist";
import AddWatchlistModal from "../modals/AddWatchlistModal";
import watchlist from "../../services/watchlist";
import { useWatchlists } from "../../context/WatchlistContext";
import { useAuth } from "../../context/AuthContext";
import watchlistService from "../../services/watchlist";
import PortfolioContent from "./PortfolioContent";
import WatchlistContent from "./WatchlistContent";

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
  portfolioValue?: [{ date: string; value: number }];
}

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeListType, setActiveListType] = useState<string>("portfolios");
  const [activeWatchlist, setActiveWatchlist] = useState<Portfolio>();
  const [activePortfolio, setActivePortfolio] = useState<Portfolio>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [addToPortfolioModalIsOpen, setAddToPortfolioModalIsOpen] =
    useState<boolean>(false);
  const [addToWatchlistModalIsOpen, setAddToWatchlistModalIsOpen] =
    useState<boolean>(false);
  const [addWatchlistModalIsOpen, setAddWatchlistModalIsOpen] =
    useState<boolean>(false);
  const { portfolios, removePortfolio, addSecurityToPortfolio } =
    usePortfolios();
  const {
    watchlists,
    removeWatchlists,
    addSecurityToWatchlist,
    appendWatchlist,
  } = useWatchlists();
  const addToWatchlistDisabled = watchlists.length > 3;
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Find the portfolio with the matching id and set activePortfolio
    if (activeListType === "portfolios") {
      const matchingPortfolio = portfolios.find((p) => p.id === id);
      if (matchingPortfolio) {
        setActivePortfolio(matchingPortfolio);
        setActiveTab(matchingPortfolio.title);
      }
    }
    if (activeListType === "watchlists") {
      const matchingWatchlist = watchlists.find((w) => w.id === id);
      if (matchingWatchlist) {
        setActiveWatchlist(matchingWatchlist);
        setActiveTab(matchingWatchlist.title);
      }
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
        removePortfolio(removedPortfolio);
      }
    }

    setShowDropdown(false);
  };

  const openAddToPortfolioModal = () => {
    setAddToPortfolioModalIsOpen(true);
  };
  const openAddToWatchlistModal = () => {
    setAddToWatchlistModalIsOpen(true);
  };
  //
  const addToList = async (newSecurity: Security) => {
    if (activePortfolio && activeListType === "portfolios") {
      addSecurityToPortfolio(activePortfolio.id, newSecurity);
    }
    if (activeWatchlist && activeListType === "watchlists") {
      addSecurityToWatchlist(activeWatchlist.id, newSecurity);
    }
  };

  const onClose = () => {
    setAddToPortfolioModalIsOpen(false);
  };

  const handleSaveWatchlist = async (watchlistName: string) => {
    const newWatchlist = {
      title: watchlistName,
      author: user?.name,
    };
    const response = await watchlistService.create(newWatchlist);
    console.log(response);
    appendWatchlist({
      id: response.id,
      title: response.title,
      author: response.author,
    });

    onCloseWatchlist();
  };

  const onCloseWatchlist = () => {
    setAddWatchlistModalIsOpen(false);
  };

  const handleListClick = (type: string) => {
    setActiveListType(`${type}`);
  };
  console.log(watchlists, watchlists.length, activeTab);
  //console.log(addToPortfolioModalIsOpen);
  // console.log(activePortfolio);
  /*   console.log("Portfolios:", portfolios); */
  /*  console.log(portfolios, activeTab, activePortfolio); */
  const Tooltip = () => (
    <div className="tooltip-lists">You may not have more than 3 watchlists</div>
  );
  return (
    <Layout>
      {addToPortfolioModalIsOpen && (
        <AddToPortfolioModal
          isOpen={addToPortfolioModalIsOpen}
          listName={activeTab}
          onClose={onClose} // Close modal function
          onSave={(symbol, quantity, purchaseDate, purchasePrice) => {
            const newSecurity = {
              symbol,
              quantity,
              purchaseDate,
              purchasePrice,
            };
            if (activeListType === "portfolios") {
              addToList(newSecurity);
            }
            if (activeListType === "watchlists") {
              console.log("added to watchlist");
              addToList(newSecurity);
            }
            console.log("Symbol:", symbol);
            console.log("Quantity:", quantity);
            console.log("Purchase Date:", purchaseDate);
            console.log("Purchase Price:", purchasePrice);
          }}
        />
      )}
      {addWatchlistModalIsOpen && (
        <AddWatchlistModal
          onCancel={onCloseWatchlist}
          onSave={(watchlistName) => {
            // Handle saving new watchlist
            handleSaveWatchlist(watchlistName);
            onClose();
          }}
        />
      )}
      <div className="portfolio-container">
        <div className="portfolio-header">
          <div className="portfolio-header-item">
            <Link to="/">
              <span className="label home-label">HOME</span>
            </Link>
            <FaAngleRight className="arrow1" />

            <span
              className={`toggle-type ${
                activeListType === "watchlists" ? "active-list" : ""
              }`}
              onClick={() => handleListClick("watchlists")}
            >
              {" "}
              Watchlist
            </span>

            <span
              className={`toggle-type ${
                activeListType === "portfolios" ? "active-list" : ""
              }`}
              onClick={() => handleListClick("portfolios")}
            >
              {" "}
              Portfolios
            </span>
          </div>
          <div className="portfolio-header-item">
            {activeListType === "watchlists" &&
              watchlists.map((watchlist) => (
                <div
                  key={watchlist.id}
                  className={`tab ${
                    activeTab === watchlist.title
                      ? "active-tab"
                      : "inactive-tab"
                  }`}
                  onClick={() => handleTabClick(watchlist.id)}
                >
                  <div className="tab-inner">
                    <FaList size={18} />
                    <span className="label">{watchlist.title}</span>
                    <span className="count">0</span>
                  </div>
                </div>
              ))}
            <div className="add-list-div">
              {addToWatchlistDisabled && activeListType === "watchlists" && (
                <>
                  <button
                    disabled={addToWatchlistDisabled}
                    className={`add-list ${
                      addToWatchlistDisabled ? "disabled" : ""
                    }`}
                    onClick={() => setAddWatchlistModalIsOpen(true)}
                  >
                    <FaPlus size={18} />
                    <span className="label">New list</span>
                  </button>{" "}
                  <Tooltip />
                </>
              )}
              {!addToWatchlistDisabled && activeListType && (
                <>
                  <button
                    disabled={addToWatchlistDisabled}
                    className={`add-list ${
                      addToWatchlistDisabled ? "disabled" : ""
                    }`}
                    onClick={() => setAddWatchlistModalIsOpen(true)}
                  >
                    <FaPlus size={18} />
                    <span className="label">New list</span>
                  </button>{" "}
                </>
              )}
            </div>

            {activeListType === "portfolios" &&
              portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className={`tab ${
                    activeTab === portfolio.title
                      ? "active-tab"
                      : "inactive-tab"
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
          </div>
        </div>
        {activeListType === "watchlist" && (
          <div>
            <Watchlist name="123list" data={[]} />
          </div>
        )}
        {activeListType === "portfolios" && (
          <div className="main-container">
            <PortfolioContent
              portfolio={activePortfolio}
              portfolioName={activeTab}
              handleDropdownOptionClick={(option: string) =>
                handleDropdownOptionClick(option)
              }
              handleDropdownToggle={handleDropdownToggle}
              showDropdown={showDropdown}
              openAddToPortfolioModal={openAddToPortfolioModal}
            />
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
        )}
        {activeListType === "watchlists" && (
          <div className="main-container">
            <WatchlistContent
              handleDropdownOptionClick={(option: string) =>
                handleDropdownOptionClick(option)
              }
              handleDropdownToggle={handleDropdownToggle}
              showDropdown={showDropdown}
              openAddToPortfolioModal={openAddToPortfolioModal}
            />
            <div>
              {activeWatchlist?.securities?.map((s) => (
                <div key={s.symbol}>
                  {s.symbol}
                  {s.quantity}
                  {s.purchaseDate}
                  {s.purchasePrice}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Portfolio;

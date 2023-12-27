import React from "react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import "./Portfolio.css";
import { useAuth } from "../../context/AuthContext";
import { useWatchlists } from "../../context/WatchlistContext";

interface WatchlistContentProps {
  handleDropdownToggle: () => void;
  handleDropdownOptionClick: (option: string) => void;
  showDropdown: boolean;
  openAddToWatchlistModal: () => void;
}

const WatchlistContent: React.FC<WatchlistContentProps> = ({
  handleDropdownToggle,
  handleDropdownOptionClick,
  showDropdown,
  openAddToWatchlistModal,
}) => {
  const { user } = useAuth();
  const { watchlists } = useWatchlists();
  const usersWatchlists = watchlists.filter((w) => w.author === user?.name);
  return (
    <>
      {usersWatchlists.length > 0 && (
        <>
          <div className="chart">
            <div className="chart-header">
              <span className="portfolio-title">Watchlist title</span>

              <div className="settings-dropdown">
                <button className="settings" onClick={handleDropdownToggle}>
                  <FaEllipsisV size={18} />
                </button>
                {showDropdown && (
                  <div className="dropdown-content">
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
          <button className="add-investment" onClick={openAddToWatchlistModal}>
            <FaPlus size={18} />
            <span className="label">Add investments</span>
          </button>{" "}
        </>
      )}
    </>
  );
};

export default WatchlistContent;

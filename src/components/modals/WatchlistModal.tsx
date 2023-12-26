import React, { useState, useEffect } from "react";
import { WatchlistSecurity, Watchlist } from "../../types/types";
import "./WatchlistModal.css";
import watchlistService from "../../services/watchlist";
import { useWatchlists } from "../../context/WatchlistContext";

interface WatchlistModalProps {
  watchlists: Watchlist[];
  onClose: () => void;
  selectedSecurity: string; // Assuming this is the symbol of the selected security
}

const WatchlistModal: React.FC<WatchlistModalProps> = ({
  watchlists,
  onClose,
  selectedSecurity,
}) => {
  const [selectedWatchlists, setSelectedWatchlists] = useState<string[]>(
    watchlists
      .filter((watchlist) =>
        watchlist.securities?.some((s) => s.symbol === selectedSecurity)
      )
      .map((watchlist) => watchlist.id)
  );
  const { setWatchlists } = useWatchlists();

  const updateWatchlists = async () => {
    const securitiesToAdd: {
      watchlistId: string;
      security: WatchlistSecurity;
    }[] = [];
    const securitiesToRemove: {
      watchlistId: string;
      security: WatchlistSecurity;
    }[] = [];

    for (const watchlist of watchlists) {
      const isInSelected = selectedWatchlists.includes(watchlist.id);
      const isInWatchlist = watchlist.securities?.some(
        (s) => s.symbol === selectedSecurity
      );

      console.log(
        `Watchlist: ${watchlist.title}, isInSelected: ${isInSelected}, isInWatchlist: ${isInWatchlist}`
      );

      if (!isInSelected && isInWatchlist) {
        securitiesToRemove.push({
          watchlistId: watchlist.id,
          security: { symbol: selectedSecurity },
        });
      } else if (
        isInSelected &&
        !isInWatchlist &&
        !securitiesToAdd.some((s) => s.watchlistId === watchlist.id)
      ) {
        securitiesToAdd.push({
          watchlistId: watchlist.id,
          security: { symbol: selectedSecurity },
        });
      }
    }

    console.log("Securities to add:", securitiesToAdd);
    console.log("Securities to remove:", securitiesToRemove);

    // Add securities to the selected watchlists only if not already present
    for (const { watchlistId, security } of securitiesToAdd) {
      try {
        await watchlistService.addToWatchlist(watchlistId, security);
        console.log(
          `Added ${security.symbol} to ${
            watchlists.find((w) => w.id === watchlistId)?.title
          }`
        );
      } catch (error) {
        console.error("Error adding security to watchlist:", error);
      }
    }

    // Remove securities from the selected watchlists
    for (const { watchlistId, security } of securitiesToRemove) {
      try {
        await watchlistService.removeSecurityFromWatchlist(
          watchlistId,
          security
        );
        console.log(
          `Removed ${security.symbol} from ${
            watchlists.find((w) => w.id === watchlistId)?.title
          }`
        );
      } catch (error) {
        console.error("Error removing security from watchlist:", error);
      }
    }

    // Fetch updated watchlists and update the UI
    const updatedWatchlistsData = await watchlistService.getAll();
    setWatchlists(updatedWatchlistsData);
  };

  return (
    <div className="watchlist-modal">
      <h2>Select Watchlists</h2>
      {watchlists.map((watchlist) => (
        <div key={watchlist.id}>
          <input
            type="checkbox"
            id={watchlist.id}
            checked={selectedWatchlists.includes(watchlist.id)}
            onChange={() => {
              setSelectedWatchlists((prev) => {
                if (prev.includes(watchlist.id)) {
                  return prev.filter((id) => id !== watchlist.id);
                } else {
                  return [...prev, watchlist.id];
                }
              });
            }}
          />
          <label htmlFor={watchlist.id}>{watchlist.title}</label>
        </div>
      ))}
      <button
        onClick={async () => {
          await updateWatchlists();
          onClose();
        }}
      >
        Submit
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default WatchlistModal;

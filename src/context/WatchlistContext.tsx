import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import watchlistService from "../services/watchlist";
import { Portfolio, Security } from "../types/types";

// ... (same interfaces for Security and Portfolio)

interface WatchlistContextProps {
  watchlists: Portfolio[];
  appendWatchlist: (newWatchlist: Portfolio) => void;
  removeWatchlist: (removedWatchlist: Portfolio) => void;
  addSecurityToWatchlist: (watchlistId: string, security: Security) => void;
}

const WatchlistContext = createContext<WatchlistContextProps | undefined>(
  undefined
);

export const WatchlistsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [watchlists, setWatchlists] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchWatchlists = async () => {
      const watchlistsData = await watchlistService.getAll();
      setWatchlists(watchlistsData);
    };

    fetchWatchlists();
  }, []); // Fetch watchlists on component mount

  const appendWatchlist = (newWatchlist: Portfolio) => {
    setWatchlists((prevWatchlists) => [...prevWatchlists, newWatchlist]);
  };

  const removeWatchlist = async (removedWatchlist: Portfolio) => {
    try {
      await watchlistService.remove(removedWatchlist.id);
      setWatchlists((prevWatchlists) =>
        prevWatchlists.filter((w) => w.id !== removedWatchlist.id)
      );
    } catch (error) {
      console.error("Error removing watchlist:", error);
      // Handle error as needed
    }
  };

  const addSecurityToWatchlist = async (
    watchlistId: string,
    security: Security
  ) => {
    const updatedWatchlists = watchlists.map((watchlist) =>
      watchlist.id === watchlistId
        ? {
            ...watchlist,
            securities: [...(watchlist.securities ?? []), security],
          }
        : watchlist
    );

    setWatchlists(updatedWatchlists);
    await watchlistService.addToWatchlist(watchlistId, security);
  };

  const contextValue = useMemo(
    () => ({
      watchlists,
      appendWatchlist,
      removeWatchlist,
      addSecurityToWatchlist,
    }),
    [watchlists]
  );

  return (
    <WatchlistContext.Provider value={contextValue}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlists = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlists must be used within a WatchlistsProvider");
  }
  return context;
};

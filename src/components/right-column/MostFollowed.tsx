import React, { useEffect, useState } from "react";
import Table from "../table/Table";
import "./Right.css";
import { Data, RowConfig } from "../table/types";
import { useAuth } from "../../context/AuthContext";
import { useWatchlists } from "../../context/WatchlistContext";
import {
  MostFollowedSecurities,
  Watchlists,
  Watchlist,
  MostFollowedSecurityWithoutDetails,
  WatchlistSecurity,
} from "../../types/types";
import WatchlistModal from "../modals/WatchlistModal";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getQuote } from "../search/quoteUtils";

const data = [
  {
    id: 100,
    symbol: "SPY",
    name: "SP 500 ETF",
    followers: "3.71M",
    price: 440,
    priceChange: 4.4,
    percentChange: 2.3,
  },
  {
    id: 200,
    symbol: "MSFT",
    name: "Microsoft",
    followers: "2.16M",
    price: 360,
    priceChange: -1.4,
    percentChange: -0.7,
  },
  {
    id: 300,
    symbol: "AAPL",
    name: "Apple Inc.",
    followers: "4.56M",
    price: 140,
    priceChange: 2.2,
    percentChange: 1.5,
  },
];
//
const MostFollowed = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState<string>();
  const mostFollowedConfig: RowConfig = {
    fields: ["symbol", "name", "percentChange"],
    addIcon: true,
    name: "most-followed",
  };
  const { watchlists, addSecurityToWatchlist, removeSecurityFromWatchlist } =
    useWatchlists();
  const { user } = useAuth();
  const [top5Securities, setTop5Securities] = useState<
    MostFollowedSecurities[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const onWatchlistChange = async (
    watchlistId: string,
    security: WatchlistSecurity,
    selected: boolean
  ) => {
    try {
      if (selected) {
        await addSecurityToWatchlist(watchlistId, security);
      } else {
        await removeSecurityFromWatchlist(watchlistId, security);
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect mostfollowed runs");
    // Count the occurrences of each symbol and calculate the total followers for each security in watchlists
    const symbolFollowers: { [symbol: string]: number } = {};

    watchlists.forEach((watchlist: Watchlist) => {
      watchlist?.securities?.forEach(
        (security: MostFollowedSecurityWithoutDetails) => {
          const { symbol } = security;
          symbolFollowers[symbol] = (symbolFollowers[symbol] || 0) + 1; // Assuming each occurrence adds 1 follower
        }
      );
    });
    // console.log(symbolFollowers);
    // Sort symbols based on their total followers in descending order
    const sortedSymbols = Object.entries(symbolFollowers).sort(
      ([symbolA, followersA], [symbolB, followersB]) => followersB - followersA
    );

    // Select the top 5 symbols with followers
    const newTop5Securities: MostFollowedSecurities[] = sortedSymbols
      .slice(0, 5)
      .map(([symbol]) => {
        const foundSecurity = data.find((s) => s.symbol === symbol);

        if (foundSecurity) {
          return {
            symbol,
            name: foundSecurity.name,
            followers: symbolFollowers[symbol],
            // Include other necessary details like price, percentChange
          };
        }

        return {
          symbol,
          name: "Unknown",
          followers: symbolFollowers[symbol],
          // Include other necessary details like price, percentChange
        };
      });
    //console.log(newTop5Securities);
    // Update the state with the new top 5 securities
    const fetchQuotes = async () => {
      try {
        setIsLoading(true); // Set loading state to true before fetching data
        // console.log("fetching quotes for top5 followed ");
        // Fetch quotes for each symbol in top5Securities
        const updatedTop5Securities = await Promise.all(
          newTop5Securities.map(async (security) => {
            const { symbol } = security;
            //   console.log(security.followers);
            const quote = await getQuote(queryClient, symbol);

            // Combine data from top5Securities and quote
            let fmtPC = "";
            if (quote?.percentChange) {
              fmtPC = (quote.percentChange * 100).toFixed(2);
            }
            return {
              id: symbol + "^_^",
              symbol,
              name: quote?.name || "",
              followers: security.followers,
              price: quote?.price || 0,
              priceChange: quote?.priceChange || 0,
              percentChange: Number(fmtPC) || 0,
            };
          })
        );
        //     console.log(updatedTop5Securities);
        //  console.log(top5Quotes);
        setTop5Securities(updatedTop5Securities);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };
    if (newTop5Securities) {
      fetchQuotes();
    }
  }, [watchlists]);

  const onIconClick = (symbol: string) => {
    //  console.log(user);
    //  console.log(symbol);
    if (!user) {
      console.log("user is not signed in");
      navigate("/login");
    }
    let s = "";
    if (typeof symbol === "string") {
      s = symbol.toLowerCase();
    }
    // console.log(s);
    setSelectedSecurity(s);
    setShowModal(true);
  };

  // console.log(user);
  // console.log(watchlists, top5Securities);
  const convertedTop5Securities: Data[] = top5Securities.map((security) => ({
    id: security.symbol,
    symbol: security.symbol,
    name: security.name,
    followers: security.followers.toString(),
    price: security.price || 0,
    priceChange: Number(security.priceChange) || 0,
    percentChange: Number(security.percentChange) || 0,
  }));
  //console.log(convertedTop5Securities);

  return (
    <div className="most-followed-container">
      <div role="heading" className="most-followed-heading">
        Most followed on Finhub
      </div>
      <div>
        <Table
          data={convertedTop5Securities}
          config={mostFollowedConfig}
          full={true}
          icon={true}
          onIconClick={onIconClick}
        />
      </div>
      {showModal && selectedSecurity && (
        <WatchlistModal
          watchlists={watchlists}
          onClose={() => setShowModal(false)}
          selectedSecurity={selectedSecurity}
        />
      )}
    </div>
  );
};

export default MostFollowed;

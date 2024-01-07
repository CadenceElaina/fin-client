import { useEffect, useRef, useState } from "react";
import Table from "../table/Table";
import "./Right.css";
import { Data, RowConfig } from "../table/types";
import { useAuth } from "../../context/AuthContext";
import { useWatchlists } from "../../context/WatchlistContext";
import {
  MostFollowedSecurities,
  Watchlist,
  MostFollowedSecurityWithoutDetails,
} from "../../types/types";
import WatchlistModal from "../modals/WatchlistModal";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getQuote } from "../search/quoteUtils";

const MostFollowed = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });
  const containerRef = useRef(null);
  const [selectedSecurity, setSelectedSecurity] = useState<string>();
  const mostFollowedConfig: RowConfig = {
    fields: ["symbol", "name", "percentChange"],
    addIcon: true,
    name: "most-followed",
  };
  const { watchlists } = useWatchlists();
  const { user } = useAuth();
  const [top5Securities, setTop5Securities] = useState<
    MostFollowedSecurities[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  //console.log(watchlists);
  useEffect(() => {
    const isMounted = true;
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
    console.log(symbolFollowers);
    // Sort symbols based on their total followers in descending order
    const sortedSymbols = Object.entries(symbolFollowers).sort(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([, followersA], [, followersB]) => followersB - followersA
    );

    // Select the top 5 symbols with followers
    const newTop5Securities: MostFollowedSecurities[] = sortedSymbols
      .slice(0, 5)
      .map(([symbol]) => {
        return {
          symbol,
          name: "Unknown",
          followers: symbolFollowers[symbol],
        };
      });
    //   console.log(newTop5Securities);
    const fetchQuotes = async () => {
      try {
        setIsLoading(true);
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
        // console.log(updatedTop5Securities);
        //  console.log(top5Quotes);
        if (isMounted) {
          setTop5Securities(updatedTop5Securities);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlists]);
  useEffect(() => {
    const containerElement = containerRef.current;

    if (containerElement) {
      const { x, y, width, height } = containerElement.getBoundingClientRect();
      console.log("X:", x, "Y:", y);

      // Pass the position information to the WatchlistModal
      setModalPosition({ left: x + width, top: y + height });
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
    followers: security.followers.toString() + "M following",
    price: security.price || 0,
    priceChange: Number(security.priceChange) || 0,
    percentChange: Number(security.percentChange) || 0,
  }));
  // console.log(convertedTop5Securities);

  return (
    <div className="most-followed-container" ref={containerRef}>
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
          style={{
            position: "absolute",
            left: modalPosition.left,
            top: modalPosition.top,
          }}
        />
      )}
    </div>
  );
};

export default MostFollowed;

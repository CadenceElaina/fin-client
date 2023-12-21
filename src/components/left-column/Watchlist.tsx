import React from "react";
import Table from "../table/Table";
import "../../App.css";
import { RowConfig } from "../table/types";
import { useWatchlists } from "../../context/WatchlistContext";

const Watchlist = () => {
  const { watchlists, appendWatchlist } = useWatchlists();
  const watchlistConfig: RowConfig = {
    fields: ["symbol", "name", "price", "priceChange", "percentChange"],
    addIcon: true,
  };

  console.log(watchlists);

  return (
    <div className="table-container">
      {" "}
      <div role="heading" className="watchlist-heading">
        Top movers in your list
      </div>
      {/*       <Table data={data} config={watchlistConfig} full={true} /> */}
    </div>
  );
};

export default Watchlist;

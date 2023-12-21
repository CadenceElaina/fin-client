import React, { useState } from "react";
import Table from "../../table/Table";
import { RowConfig } from "../../table/types";
import CustomButton from "../../CustomButton";
import AddWatchlistModal from "../../modals/AddWatchlistModal";
import { useWatchlists } from "../../../context/WatchlistContext";
import { useAuth } from "../../../context/AuthContext";

interface WatchlistProps {
  name: string;
  data: any;
}

const Watchlist: React.FC<WatchlistProps> = ({ data }) => {
  const { user } = useAuth();
  const { watchlists, appendWatchlist } = useWatchlists();

  const [isAddWatchlistModalVisible, setIsAddWatchlistModalVisible] =
    useState(false);

  const watchlistConfig: RowConfig = {
    fields: ["id", "symbol", "name", "price", "priceChange", "percentChange"],
    addIcon: true,
  };

  const addInvestment = () => {
    console.log("added invs");
  };

  const openAddWatchlistModal = () => {
    setIsAddWatchlistModalVisible(true);
  };

  const closeAddWatchlistModal = () => {
    setIsAddWatchlistModalVisible(false);
  };

  const saveNewWatchlist = (watchlistName: string) => {
    // Add the new security to the selected watchlist
    const selectedWatchlist = watchlists.find(w => w.title === watchlistName);


    // Close the modal
    closeAddWatchlistModal();
  };

  return (
    <div>
      <div className="watchlist-table">
        <Table data={data} config={watchlistConfig} full={true} />
      </div>
      {isAddWatchlistModalVisible && (
        <AddWatchlistModal
          onCancel={closeAddWatchlistModal}
          onSave={saveNewWatchlist}
        />
      )}
    </div>
  );
};

export default Watchlist;

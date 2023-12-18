import React, { useState } from "react";
import Table from "../../table/Table";
import { RowConfig } from "../../table/types";
import CustomButton from "../../CustomButton";
import AddWatchlistModal from "../../modals/AddWatchlistModal";

interface WatchlistProps {
  name: string;
  data: any;
}

const Watchlist: React.FC<WatchlistProps> = ({ name, data }) => {
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
    // Perform actions to save the new watchlist
    console.log("Saving new watchlist:", watchlistName);

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

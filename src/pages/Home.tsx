import * as React from "react";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import Layout from "../components/layout/Layout";
import Markets from "../components/markets/Markets";
import Search from "../components/search/Search";
import Watchlist from "../components/left-column/Watchlist";
import News from "../components/left-column/news/News";
import AddPortfolio from "../components/portfolio/AddPortfolio";
import MarketTrends from "../components/right-column/MarketTrends";
import MostFollowed from "../components/right-column/MostFollowed";
import MarketTrendsList from "../components/MarketTrendsList";
import DiscoverMore from "../components/slider/DiscoverMore";
import Footer from "../components/Footer";
import PositionedSnackbar from "../components/PositionedSnackbar";
import { useEffect, useState } from "react";
import { SnackbarType } from "../types/types";
import { useAuth } from "../AuthContext";

interface HomeProps {
  portfolios: [];
}

const Home: React.FC<HomeProps> = () => {
  const { user } = useAuth(); // Use the useAuth hook to access the authentication context
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  useEffect(() => {
    // Check if a user is logged in and log the authentication context
    if (user) {
      console.log("User is logged in. User:", user);
      setSnackbar({
        open: true,
        message: `Welcome back, ${user.name}!`,
        type: "success",
      });
    }
  }, [user]); // Run this effect only when the user changes
  console.log(user);
  return (
    <>
      <Layout>
        <div className="content-wrapper">
          <Markets />
          <Search />
          <div className="main-content-container">
            <div className="main-content-left">
              <Watchlist />
              <News />
            </div>
            <div className="main-content-right">
              <AddPortfolio />
              <MarketTrends />
              <MostFollowed />
            </div>
          </div>
          <LoginModal />
          <RegisterModal />
          <MarketTrendsList />
          <DiscoverMore />
          <Footer />
        </div>
        {snackbar.open && (
          <PositionedSnackbar
            message={snackbar.message}
            type={snackbar.type as SnackbarType}
            isOpen={snackbar.open}
            onClose={handleSnackbarClose}
          />
        )}
      </Layout>
    </>
  );
};

export default Home;

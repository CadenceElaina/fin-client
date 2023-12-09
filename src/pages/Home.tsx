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
import DiscoverMore from "../components/DiscoverMore";
import Footer from "../components/Footer";

interface HomeProps {
  portfolios: [];
}

const Home: React.FC<HomeProps> = () => {
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
      </Layout>
    </>
  );
};

export default Home;

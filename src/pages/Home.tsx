import * as React from "react";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import Layout from "../components/layout/Layout";
import Markets from "../components/Markets";
import Search from "../components/search/Search";
import Watchlist from "../components/watchlist/Watchlist";

interface HomeProps {
  portfolios: [];
}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <Layout>
        <div className="content-wrapper">
          <Markets />
          <Watchlist />
          <Search />
          <LoginModal />
          <RegisterModal />
          <div>Home</div>
        </div>
      </Layout>
    </>
  );
};

export default Home;

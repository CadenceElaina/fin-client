import React, { useState } from "react";
import { FaChartBar } from "react-icons/fa";
import { usePortfolios } from "../../../context/PortfoliosContext";
import CustomButton from "../../CustomButton";
import portfolioService from "../../../services/portfolios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import NewPortfolioModal from "../../modals/AddPortfolioModal";
import "./Portfolio.css";

const YourPortfolios = () => {
  const { portfolios, appendPortfolio } = usePortfolios();
  const { user } = useAuth();
  const auth = !!user;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (!auth) {
      navigate("/login");
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSavePortfolio = async (portfolioName: string) => {
    // Handle saving the portfolio data (you can implement this part)
    const newPortfolio = {
      title: portfolioName,
      author: user?.name,
    };
    const response = await portfolioService.create(newPortfolio);
    console.log(response);
    // appendPortfolio to our context state
    appendPortfolio({
      id: response.id,
      title: response.title,
      author: response.author,
    });

    closeModal();
    navigate(`/portfolio/${response.id}`);
  };
  return (
    <div className="add-portfolio-container">
      <div className="add-portfolio-header">
        {/* Portfolio/Graph icon */}
        <div className="add-portfolio-icon">
          <FaChartBar size={30} />
        </div>

        <div className="add-portfolio-text">Your portfolios</div>
      </div>
      <div className="portfolio-value">$0.00</div>
      <div className="portfolio-list">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="portfolio">
            <div className="tab-inner">
              <span className="label">{portfolio.title}</span>
              <span className="count">0</span>
            </div>
          </div>
        ))}
      </div>
      <div className="add-portfolio-button">
        <CustomButton
          label="New Portfolio"
          onClick={openModal}
          fullWidth
          large
          /*    auth={auth} */
        />
      </div>
      {/* Render the modal conditionally */}
      {isModalOpen && (
        <NewPortfolioModal onCancel={closeModal} onSave={handleSavePortfolio} />
      )}
    </div>
  );
};

export default YourPortfolios;

import React, { useState } from "react";
import CustomButton from "../../CustomButton"; // Update the path to CustomButton based on your project structure
import { FaChartBar } from "react-icons/fa";
import "./Portfolio.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ModalBackdrop from "../../modals/ModalBackdrop";
import NewPortfolioModal from "../../modals/AddPortfolioModal";

const AddPortfolio = () => {
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
  const handleSavePortfolio = (portfolioName: string) => {
    // Handle saving the portfolio data (you can implement this part)
    alert(`Saving portfolio with name: ${portfolioName}`);
    closeModal();
  };
  return (
    <div className="add-portfolio-container">
      <div className="portfolio-header">
        {/* Portfolio/Graph icon */}
        <div className="portfolio-icon">
          <FaChartBar size={30} />
        </div>

        <div className="portfolio-text">
          Create a portfolio to view your investments in one place
        </div>
      </div>

      {/* Button */}
      <div className="portfolio-button">
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

export default AddPortfolio;

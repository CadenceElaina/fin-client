import  { useState } from "react";
import CustomButton from "../../CustomButton";
import { FaChartBar } from "react-icons/fa";
import "./Portfolio.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import portfolioService from "../../../services/portfolios";
import NewPortfolioModal from "../../modals/AddPortfolioModal";
import { usePortfolios } from "../../../context/PortfoliosContext";
import { useNotification } from "../../../context/NotificationContext";

const AddPortfolio = () => {
  const {  appendPortfolio } = usePortfolios();
  const { addNotification } = useNotification();
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
    // Handle saving the portfolio data
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
    addNotification(`${newPortfolio.title} added!`, "success");
    closeModal();
    navigate(`/portfolio/${response.id}`);
  };
  return (
    <div className="add-portfolio-container">
      <div className="add-portfolio-header">
        <div className="add-portfolio-icon">
          <FaChartBar size={30} />
        </div>
        <div className="add-portfolio-text">
          Create a portfolio to view your investments in one place
        </div>
      </div>
      <div className="add-portfolio-button">
        <CustomButton
          label="New Portfolio"
          onClick={openModal}
          fullWidth
          large
        />
      </div>
      {isModalOpen && (
        <NewPortfolioModal onCancel={closeModal} onSave={handleSavePortfolio} />
      )}
    </div>
  );
};

export default AddPortfolio;

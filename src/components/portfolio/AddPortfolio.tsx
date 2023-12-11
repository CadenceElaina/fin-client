import React from "react";
import CustomButton from "../CustomButton"; // Update the path to CustomButton based on your project structure
import { FaChartBar } from "react-icons/fa";
import "./Portfolio.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const AddPortfolio = () => {
  const { user } = useAuth();
  const auth = !!user;
  const navigate = useNavigate();
  const onAddPortfolio = () => {
    if (!auth) {
      navigate("/login");
    } else {
      alert(
        "add create a new portfolio modal - input: portfolio name - cancel save"
      );
    }
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
          onClick={onAddPortfolio}
          fullWidth
          large
          /*    auth={auth} */
        />
      </div>
    </div>
  );
};

export default AddPortfolio;

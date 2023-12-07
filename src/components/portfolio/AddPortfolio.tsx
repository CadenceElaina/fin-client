import React from "react";
import CustomButton from "../CustomButton"; // Update the path to CustomButton based on your project structure
import { FaChartBar } from "react-icons/fa";
import "./portfolio.css";
const AddPortfolio = () => {
  const onAddPortfolio = () => {
    console.log("port added");
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
        />
      </div>
    </div>
  );
};

export default AddPortfolio;

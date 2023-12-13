import React, { useState } from "react";
import CustomButton from "../CustomButton";
import "./AddPortfolio.css";
import ModalBackdrop from "./ModalBackdrop";

interface AddPortfolioProps {
  onCancel: () => void;
  onSave: (portfolioName: string) => void;
}

const AddPortfolioModal: React.FC<AddPortfolioProps> = ({
  onCancel,
  onSave,
}) => {
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPortfolioName(e.target.value);
    setIsSaveDisabled(portfolioName.trim() === ""); // Disable Save if the input is empty or contains only spaces
  };

  const handleClose = () => {
    /*  console.log("Before closing - isVisible:", isVisible); */
    setIsVisible(false);
    /*     console.log("After closing - isVisible:", isVisible); */
    onCancel();
  };

  const handleSave = () => {
    onSave(portfolioName);
  };

  return (
    <>
      <ModalBackdrop
        visible={isVisible}
        onClick={handleClose}
        onBackdropClick={handleClose}
      />
      <div className={`new-portfolio-modal ${isVisible ? "visible" : ""}`}>
        <div className="modal-header">
          <h3>Create a new portfolio</h3>
        </div>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Portfolio name"
            value={portfolioName}
            onChange={handleInputChange}
          />
        </div>
        <div className="modal-footer">
          <CustomButton label="Cancel" onClick={() => handleClose()} />
          <CustomButton
            label="Save"
            onClick={handleSave}
            disabled={isSaveDisabled}
          />
        </div>
      </div>
    </>
  );
};

export default AddPortfolioModal;

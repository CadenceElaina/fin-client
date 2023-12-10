import React, { useState } from "react";
import { FaBars, FaChevronLeft, FaUncharted } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "./Layout.css";
import CustomButton from "../CustomButton";
import { useNavigate } from "react-router-dom";
/* import ThemeToggle from "../../ThemeToggle"; */

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const auth = false;
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div className={`layout-container ${open ? "open" : ""}`}>
      <div
        className={`overlay ${open ? "open" : ""}`}
        onClick={handleDrawerClose}
      ></div>
      {/* Top Banner */}
      <div className="top-banner">
        <div className="logo-container">
          <button className="menu-button" onClick={handleDrawerToggle}>
            {open ? <FaChevronLeft /> : <FaBars />}
          </button>
          <span className="logo">
            {" "}
            <FaUncharted size={24} />
            <span>Finhub</span>
          </span>
        </div>

        <CustomButton
          label={"Sign in"}
          onClick={handleClick}
          auth={auth}
          primary={true}
        />
      </div>

      <div className="container">
        {/* Sidebar */}
        {open && (
          <div className="sidebar">
            <div className="sidebar-header">
              <button className="close-button" onClick={handleDrawerClose}>
                <FaChevronLeft />
              </button>
            </div>
            {/* Your Sidebar component */}
            <Sidebar
              isOpen={false}
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={`main-content ${open ? "open" : ""}`}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

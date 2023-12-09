import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" role="content-info">
      <ul className="footer-list">
        <li>
          <Link to="/">Finhub</Link>
        </li>
        <li>
          <Link to="/help">Help</Link>
        </li>
        <li>
          <Link to="/send-feedback">Send feedback</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy</Link>
        </li>
        <li>
          <Link to="/terms">Terms</Link>
        </li>
        <li>
          <Link to="/disclaimer">Disclaimer</Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;

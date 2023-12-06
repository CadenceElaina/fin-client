import React from "react";

interface FooterProps {
  label: string;
}

const Footer: React.FC<FooterProps> = ({ label }) => {
  return (
    <div>
      <div>{label}</div>
    </div>
  );
};

export default Footer;

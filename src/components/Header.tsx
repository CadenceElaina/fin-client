import React from "react";

interface HeaderProps {
  showBackArrow?: boolean;
  label: string;
}

const Header: React.FC<HeaderProps> = ({ /* showBackArrow ,*/ label }) => {
  return (
    <div>
      <h1>{label}</h1>
    </div>
  );
};

export default Header;

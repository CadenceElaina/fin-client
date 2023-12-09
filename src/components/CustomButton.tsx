interface ButtonProps {
  active?: boolean;
  label: string;
  secondary?: boolean;
  tertiary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick: () => void;
  disabled?: boolean;
  outline?: boolean;
  auth?: boolean;
}

import React from "react";

const CustomButton: React.FC<ButtonProps> = ({
  active,
  label,
  secondary,
  tertiary,
  fullWidth,
  onClick,
  large,
  disabled,
  outline,
  auth,
}) => {
  return (
    <button
      disabled={auth || disabled}
      onClick={onClick}
      className={`
      ${active ? "active" : ""}
      ${auth ? "auth" : ""}
      ${tertiary ? "tertiary" : ""}
      ${fullWidth ? "full-width" : ""}
      ${secondary ? "secondary" : "button"}
      ${large ? "large" : ""}
      ${outline ? "button-outline" : ""}
      `}
    >
      {label}
    </button>
  );
};

export default CustomButton;

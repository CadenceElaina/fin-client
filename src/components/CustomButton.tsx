interface ButtonProps {
  active?: boolean;
  label: string;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  outline?: boolean;
  auth?: boolean;
}

import React from "react";

const CustomButton: React.FC<ButtonProps> = ({
  active,
  label,
  primary,
  secondary,
  tertiary,
  fullWidth,
  onClick,
  onCancel,
  large,
  disabled,
  outline,
  auth,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default behavior of the button
    if (onCancel) {
      onCancel(); // Call onCancel function if provided
    } else if (onClick) {
      onClick(); // Call onClick function if provided
    }
  };
  return (
    <button
      /*       disabled={auth || disabled} */
      disabled={disabled}
      onClick={handleClick}
      className={`
      ${active ? "active" : ""}
      ${auth ? "auth" : "no-auth"}
      ${primary ? "primary" : ""}
      ${tertiary ? "tertiary" : ""}
      ${fullWidth ? "full-width" : ""}
      ${secondary ? "secondary" : "button"}
      ${large ? "large" : ""}
      ${outline ? "button-outline" : ""}
      ${disabled ? "disabled" : ""} 
      `}
    >
      {label}
    </button>
  );
};

export default CustomButton;

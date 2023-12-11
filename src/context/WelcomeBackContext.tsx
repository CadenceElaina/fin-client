import { createContext, useContext, ReactNode, useState } from "react";

interface WelcomeBackContextProps {
  showWelcomeBack: boolean;
  setShowWelcomeBack: (value: boolean) => void;
}

const WelcomeBackContext = createContext<WelcomeBackContextProps | undefined>(
  undefined
);

export const WelcomeBackProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  return (
    <WelcomeBackContext.Provider
      value={{ showWelcomeBack, setShowWelcomeBack }}
    >
      {children}
    </WelcomeBackContext.Provider>
  );
};

export const useWelcomeBack = () => {
  const context = useContext(WelcomeBackContext);

  if (!context) {
    throw new Error("useWelcomeBack must be used within a WelcomeBackProvider");
  }

  return context;
};

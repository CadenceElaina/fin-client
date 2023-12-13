//PortfoliosContext.tsx
/*
append portfolio function - concat portfolio to our state so that if we add a new portfolio the UI stays in sync
const blogs = await portfolioService.getAll();
*/
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import portfolioService from "../services/portfolios";

interface Portfolio {
  id: string;
  title: string;
  author: string | undefined;
}

interface PortfoliosContextProps {
  portfolios: Portfolio[];
  appendPortfolio: (newPortfolio: Portfolio) => void;
  removePortfolio: (removedPortfolio: Portfolio) => void;
}

const PortfoliosContext = createContext<PortfoliosContextProps | undefined>(
  undefined
);

export const PortfoliosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      const portfoliosData = await portfolioService.getAll();
      setPortfolios(portfoliosData);
    };

    fetchPortfolios();
  }, []); // Fetch portfolios on component mount

  const appendPortfolio = (newPortfolio: Portfolio) => {
    setPortfolios((prevPortfolios) => [...prevPortfolios, newPortfolio]);
  };

  const removePortfolio = async (removedPortfolio: Portfolio) => {
    try {
      // Remove the portfolio from the server
      await portfolioService.remove(removedPortfolio.id);

      // Update the portfolios state
      setPortfolios((prevPortfolios) =>
        prevPortfolios.filter((p) => p.id !== removedPortfolio.id)
      );
    } catch (error) {
      console.error("Error removing portfolio:", error);
      // Handle error as needed
    }
  };
  /*   const removePortfolio = (removedPortfolio: Portfolio) => {
    setPortfolios(portfolios.filter((p) => p.id !== removedPortfolio.id));
  }; */

  const contextValue = useMemo(
    () => ({ portfolios, appendPortfolio, removePortfolio }),
    [portfolios]
  );

  return (
    <PortfoliosContext.Provider
      value={contextValue}
      /*   value={{ portfolios, appendPortfolio, removePortfolio }} */
    >
      {children}
    </PortfoliosContext.Provider>
  );
};

export const usePortfolios = () => {
  const context = useContext(PortfoliosContext);
  if (!context) {
    throw new Error("usePortfolios must be used within a PortfoliosProvider");
  }
  return { ...context, removePortfolio: context.removePortfolio };
};

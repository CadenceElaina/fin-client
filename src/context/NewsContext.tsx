import React, { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getNews } from "../components/left-column/news/newsUtils";
/* import Articles from "../components/left-column/news/Articles";
import Article from "../components/market-trends/news/Article"; */
import { article } from "../types/types";

interface NewsContextProps {
  newsData: article[];
}

const NewsContext = createContext<NewsContextProps | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [newsData, setNewsData] = useState<article[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchNewsData = async () => {
      const data = await getNews(queryClient);
      setNewsData(data);
    };

    fetchNewsData();
  }, [queryClient]);

  return (
    <NewsContext.Provider value={{ newsData }}>{children}</NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context.newsData;
};

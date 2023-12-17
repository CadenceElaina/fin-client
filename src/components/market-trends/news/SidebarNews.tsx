import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Article from "./Article";
import { article, articleProps } from "../../left-column/news/types";
import { getNews } from "../../left-column/news/newsUtils";
import "../MarketTrends.css";
import { useNews } from "../../../context/NewsContext";

const SidebarNews = () => {
  /*   const [newsData, setNewsData] = useState<article[]>([]); // State to hold the news data */
  const newsData = useNews();

  // Generate 9 random articles
  const numRandomArticles = 6;
  const randomIndexes = Array.from(
    { length: Math.min(numRandomArticles, newsData.length) },
    () => Math.floor(Math.random() * newsData.length)
  );

  // Get the selected random articles from newsData
  const randomArticles = randomIndexes.map((index) => newsData[index]);

  /*   const queryClient = useQueryClient(); // Get the QueryClient instance

  useEffect(() => {
    // Use the getNews function to fetch news data
    const fetchNewsData = async () => {
      const data = await getNews(queryClient);
      setNewsData(data);
    };

    fetchNewsData(); // Call the function on mount
  }, [queryClient]);
  console.log(newsData); */
  return (
    <div className="sidebar-news">
      Sidebar News
      <div>
        <div role="heading" className="news-heading">
          Today's financial news
        </div>
        <div>
          <Article articles={randomArticles} />
        </div>
      </div>
    </div>
  );
};

export default SidebarNews;

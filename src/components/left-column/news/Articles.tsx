import React from "react";
import { articleProps } from "./types";
import "./news.css"; // Import your CSS file with the styles

const Articles: React.FC<articleProps> = ({ articles, currNewsSegment }) => {
  // Filter stories based on the current segment
  let filteredArticles = [];
  if (currNewsSegment) {
    filteredArticles = articles.filter((article) =>
      Array.isArray(article.segment)
        ? article.segment.includes(currNewsSegment)
        : article.segment === currNewsSegment
    );
  } else {
    filteredArticles = articles;
  }
  return (
    <div>
      {filteredArticles.map((article) => (
        <div key={article.id} className="story-container">
          <div className="story-row">
            <div className="story-column">
              <div className="story-source-time">
                <div className="source">{article.source}</div>
                <div className="time">{article.time}</div>
              </div>
              <div className="title">{article.title}</div>
              <div className="related-symbol">{article.relatedSymbol}</div>
            </div>
            <div className="story-column-image">
              <img
                src={article.img}
                alt={article.title}
                className="story-image"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Articles;

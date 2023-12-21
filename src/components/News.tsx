import React from 'react'

const News = () => {
  return (
    <>
       <div key={article.id} className="story-container">
          <div className="story-row">
            <div className="story-column">
              <div
                className="story-source-time"
                onClick={() => handleArticleClick(article.link)}
              >
                <div className="source">{article.source}</div>
                <div className="time">{article.time}</div>
              </div>
              <div
                className="title"
                onClick={() => handleArticleClick(article.link)}
              >
                {article.title}
              </div>
              <div
                className="related-symbol"
                onClick={() => handleSymbolClick(article.relatedSymbol)}
              >
                {article.relatedSymbol}
              </div>
            </div>
            <div className="story-column-image">
              <img
                src={article.img}
                alt={article.title}
                className="story-image"
                onClick={() => handleArticleClick(article.link)}
              />
            </div>
          </div>
        </div>
    </>
  )
}

export default News
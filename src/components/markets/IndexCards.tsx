import React from "react";
import { IndexCardProps, IndexCard } from "./types";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const IndexCards: React.FC<IndexCardProps> = ({ cards, currExchange }) => {
  return (
    <div className="index-cards-inner">
      {cards
        .filter((card: IndexCard) => card.exchange === currExchange)
        .map((card: IndexCard) => (
          <div className="index-card-content" key={card.symbol}>
            <div className="index-card-icon">
              {card.priceChange > 0 ? (
                <FaArrowUp style={{ color: "green" }} />
              ) : card.priceChange === 0 ? (
                <></>
              ) : (
                <FaArrowDown style={{ color: "red" }} />
              )}
            </div>
            <div className="index-card-name-price">
              <div className="index-card-name">{card.name}</div>
              <div className="index-card-price">{card.price}</div>
            </div>
            <div className="index-card-change">
              <div
                className={`index-card-percent-change ${
                  card.percentChange > 0
                    ? "positive"
                    : card.percentChange === 0
                    ? ""
                    : "negative"
                }`}
              >
                {card.percentChange > 0
                  ? "+"
                  : card.percentChange === 0
                  ? ""
                  : "-"}
                {card.percentChange}%
              </div>
              <div
                className={`index-card-price-change ${
                  card.priceChange > 0
                    ? "positive"
                    : card.priceChange === 0
                    ? ""
                    : "negative"
                }`}
              >
                <div>{card.priceChange}</div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default IndexCards;

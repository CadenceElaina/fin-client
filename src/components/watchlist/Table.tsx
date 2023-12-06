import * as React from "react";
import { FaPlus } from "react-icons/fa";
import "./Watchlist.css";

interface Data {
  id: number;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  percentChange: number;
}

interface TableProps {
  data: Data[];
}

const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <ul className="custom-list">
      {data.map((item) => (
        <li key={item.id} className="list-item">
          <div className="item-content">
            <div
              className={"item-field symbol"}
              style={{
                backgroundColor: getRandomColor(),
              }} // Apply the random color to item.symbol
            >
              <span className="field-value">{item.symbol}</span>
            </div>
            <div className={"item-field"}>
              <span className="field-value">{item.name}</span>
            </div>
            <div className={"item-field"}>
              <span className="field-value">{item.price}</span>
            </div>
            <div
              className={`item-field ${
                item.priceChange < 0
                  ? "negative"
                  : item.priceChange > 0
                  ? "positive"
                  : "no-change"
              }`}
            >
              <span className="field-value">{item.priceChange}</span>
            </div>
            <div
              className={`item-field ${
                item.percentChange < 0
                  ? "negative"
                  : item.percentChange > 0
                  ? "positive"
                  : "no-change"
              }`}
            >
              <span
                className={`field-value percent-change ${
                  item.percentChange < 0
                    ? "negative-percent"
                    : item.percentChange > 0
                    ? "positive-percent"
                    : ""
                }`}
              >
                {item.percentChange}%
              </span>
            </div>
            <div className="item-field">
              <span className="field-value">
                <FaPlus />
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Table;

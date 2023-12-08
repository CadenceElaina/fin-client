import * as React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./Watchlist.css";
import { IoMdAddCircleOutline } from "react-icons/io";

interface Data {
  id: number;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  percentChange: number;
  article?: string;
  followers?: number;
}

// Define a union type for allowed field names
type AllowedFields =
  | "id"
  | "symbol"
  | "name"
  | "price"
  | "priceChange"
  | "percentChange"
  | "followers";

interface TableProps {
  data: Data[];
  config: RowConfig;
  full: boolean;
}

interface RowConfig {
  fields: string[]; // Fields to display in each row
  addIcon?: boolean; // Whether to display the add icon
}

const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getChangeStyle = (change: number): string => {
  if (change > 0) {
    return "positive";
  } else if (change < 0) {
    return "negative";
  } else {
    return "";
  }
};

const getPriceChangePrefix = (change: number): string => {
  return change !== 0 ? (change > 0 ? "+$" : "-$") : "";
};

const getPriceChangeColor = (change: number): string => {
  return change > 0 ? "#00ff00" : "rgb(217, 48, 37)";
};

const Table: React.FC<TableProps> = ({ data, config, full }) => {
  return (
    <ul className={`custom-list${full ? "-full" : ""}`}>
      {data.map((item) => (
        <li key={item.id} className="list-item">
          <div className="item-content">
            {(config.fields as AllowedFields[]).map((field) =>
              config.fields.includes(field) ? (
                <div key={field} className={`item-field ${field}`}>
                  {field === "symbol" && (
                    <div
                      className="field-value-symbol"
                      style={{
                        backgroundColor: getRandomColor(),
                      }}
                    >
                      {item[field]}
                    </div>
                  )}
                  {field !== "symbol" &&
                    field !== "price" &&
                    field !== "percentChange" &&
                    field !== "priceChange" && (
                      <div className="field-value">{item[field]}</div>
                    )}
                  {field === "price" && (
                    <div className="field-value">${item.price}</div>
                  )}
                  {field === "percentChange" && (
                    <div className={`item-field percent-change`}>
                      <div
                        className={`${getChangeStyle(
                          item.percentChange
                        )}-percent`}
                      >
                        <div className={`field-value percent-change`}>
                          {item.percentChange !== 0 && (
                            <>
                              {item.percentChange > 0 ? (
                                <FaArrowUp
                                  style={{
                                    color: getPriceChangeColor(
                                      item.percentChange
                                    ),
                                    marginRight: "5px",
                                  }}
                                />
                              ) : (
                                <FaArrowDown
                                  style={{
                                    color: getPriceChangeColor(
                                      item.percentChange
                                    ),
                                    marginRight: "5px",
                                  }}
                                />
                              )}
                              <span
                                className={getChangeStyle(item.percentChange)}
                              >
                                {" "}
                                {item.percentChange < 0
                                  ? item.percentChange.toString().split("-")
                                  : item.percentChange}
                                %
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {field === "priceChange" && (
                    <div className={`item-field price-change`}>
                      <div
                        className={`field-value price-change ${getChangeStyle(
                          item.priceChange
                        )}`}
                      >
                        {getPriceChangePrefix(item.priceChange)}
                        {item.priceChange !== 0 && (
                          <>
                            {item.priceChange < 0
                              ? item.priceChange.toString().split("-")
                              : item.priceChange}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : null
            )}
            {config.addIcon && (
              <div className="field-value-icon">
                <IoMdAddCircleOutline size={24} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Table;

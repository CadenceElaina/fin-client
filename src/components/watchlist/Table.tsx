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
}

interface TableProps {
  data: Data[];
  full: boolean;
  news: boolean;
}

const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Table: React.FC<TableProps> = ({ data, full, news }) => {
  return (
    <ul className={`custom-list${full ? "-full" : ""} ${news ? "news" : ""}`}>
      {data.map((item) => (
        <li key={item.id} className="list-item">
          <div className="item-content">
            <div
              className={"item-field symbol"}
              // Apply the random color to item.symbol
            >
              <div>
                <div
                  className="field-value-symbol"
                  style={{
                    backgroundColor: getRandomColor(),
                  }}
                >
                  {" "}
                  {item.symbol}
                </div>
              </div>
              <div className="field-value">{item.name}</div>
            </div>

            {item?.article && (
              <div className={"item-field article"}>
                <div className="field-value">{item.article}</div>
              </div>
            )}
            <div className={"item-field price"}>
              <div className="field-value">${item.price}</div>
            </div>
            <div className={`item-field price-change`}>
              <div className="field-value">
                {item.priceChange !== 0 && (item.priceChange > 0 ? "+$" : "-$")}

                {item.priceChange < 0
                  ? item.priceChange.toString().split("-")
                  : item.priceChange}
              </div>
            </div>
            <div className={`item-field percent-change`}>
              <div
                className={`${
                  item.percentChange < 0
                    ? "negative-percent"
                    : item.percentChange > 0
                    ? "positive-percent"
                    : ""
                }`}
              >
                <div className={`field-value percent-change`}>
                  {item.percentChange !== 0 &&
                    (item.percentChange > 0 ? (
                      <>
                        <FaArrowUp
                          style={{ color: "#00ff00", marginRight: "5px" }}
                        />
                      </>
                    ) : (
                      <>
                        <FaArrowDown
                          style={{
                            color: "rgb(217, 48, 37)",
                            marginRight: "5px",
                          }}
                        />
                      </>
                    ))}
                  <span
                    className={`${
                      item.percentChange > 0 ? "positive" : "negative"
                    }`}
                  >
                    {" "}
                    {item.percentChange < 0
                      ? item.percentChange.toString().split("-")
                      : item.percentChange}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div className="field-value-icon">
              <IoMdAddCircleOutline size={24} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Table;

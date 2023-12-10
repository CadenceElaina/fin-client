import React from "react";
import { Data /* ArrowProps */ } from "./types";
import "./DiscoverMore.css"; // Import the CSS file for your custom styles
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
/* import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; */
import Slider from "react-slick";
/* interface DiscoverMoreProps {
  data: Data[];
} */

const data: Data[] = [
  { symbol: "MSFT", name: "Microsoft", price: 373.45, percentChange: 0.67 },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc Class A",
    price: 134.99,
    percentChange: -1.42,
  },
  { symbol: "AMZN", name: "Amazon", price: 147.42, percentChange: 0.37 },
  { symbol: "MSFT", name: "Microsoft", price: 373.45, percentChange: 0.67 },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc Class A",
    price: 134.99,
    percentChange: -1.42,
  },
  { symbol: "AMZN", name: "Amazon", price: 147.42, percentChange: 0.37 },
  { symbol: "MSFT", name: "Microsoft", price: 373.45, percentChange: 0.67 },
  {
    symbol: "QQQ",
    name: "Nasdaq 100",
    price: 340.99,
    percentChange: -0.52,
  },
  { symbol: "V", name: "Visa", price: 375.42, percentChange: 0.77 },
  { symbol: "AAPL", name: "AAPL", price: 314.95, percentChange: 0.87 },
  {
    symbol: "BAC",
    name: "Bank of America",
    price: 30.99,
    percentChange: -2.02,
  },
  { symbol: "META", name: "Facebook", price: 380.42, percentChange: 0.97 },
  { symbol: "WFC", name: "Wells Fargo", price: 56.88, percentChange: 0.55 },
  { symbol: "BABA", name: "Alibaba", price: 77.69, percentChange: -1.43 },
  // Add more data as needed
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NextArrow: React.FC<any> = (props) => (
  <div className="arrow next" onClick={props.onClick}>
    <FaChevronRight />
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrevArrow: React.FC<any> = (props) => (
  <div className="arrow prev" onClick={props.onClick}>
    <FaChevronLeft />
  </div>
);

const DiscoverMore: React.FC = () => {
  const settings = {
    dots: false,
    infinite: false,
    swipeToSlide: true,
    speed: 500,

    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="discover-container">
      <div role="heading" className="discover-heading">
        Discover more
      </div>
      <div role="heading" className="discover-subheading">
        You may be interested in
      </div>

      <Slider {...settings} className="slider">
        {data.map((security) => (
          <div key={security.symbol} className="card">
            <div className="card-content">
              <div>{security.symbol}</div>
              <div>{security.name}</div>
              <div>{security.price}</div>
              <div>{security.percentChange}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DiscoverMore;

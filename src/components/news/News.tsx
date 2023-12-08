import React, { useState } from "react";

import Story from "./Story";
import { newsSegmentType, story } from "./types";
import CustomButton from "../CustomButton";

const data: story[] = [
  {
    id: "1",
    source: "CNBC",
    time: "4 hours ago",
    title:
      "Jamie Dimon lashes out against crypto: `I want the government to supress decentralized options`",
    relatedSymbol: "btc",
    img: "src",
    segment: ["Top", "World"],
  },
  {
    id: "2",
    source: "Yahoo Finance",
    time: "7 hours ago",
    title: "Stock market news today: US Stonks...",
    relatedSymbol: "msft",
    img: "src",
    segment: "Top",
  },
  {
    id: "3",
    source: "Yahoo Finance",
    time: "7 hours ago",
    title: "Stock market news today: US Stonks...",
    relatedSymbol: "aapl",
    img: "src",
    segment: ["Top", "World"],
  },
  {
    id: "4",
    source: "Yahoo Finance",
    time: "7 hours ago",
    title: "Stock market news today: US Stonks...",
    relatedSymbol: "msft",
    img: "src",
    segment: "Local",
  },
];

const News = () => {
  const [currNewsSegment, setCurrNewsSegment] =
    useState<newsSegmentType>("Top");

  const newsSegmentValues: newsSegmentType[] = ["Top", "Local", "World"];

  const handleButtonClick = (segment: newsSegmentType) => {
    setCurrNewsSegment(segment);
  };

  return (
    <div>
      <div role="heading" className="news-heading">
        Today's financial news
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {newsSegmentValues.map((segment) => (
          <CustomButton
            key={segment}
            label={segment}
            secondary={true}
            onClick={() => handleButtonClick(segment)}
            active={currNewsSegment === segment}
          />
        ))}
      </div>
      <div>
        <Story stories={data} currNewsSegment={currNewsSegment} />
      </div>
    </div>
  );
};

export default News;

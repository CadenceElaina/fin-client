import React, { useState, useEffect } from "react";
import { newsSegmentType } from "./types";
import { article } from "./types";
import CustomButton from "../../CustomButton";
import Articles from "./Articles";
import { useNews } from "../../../context/NewsContext";
const News = () => {
  const [currNewsSegment, setCurrNewsSegment] =
    useState<newsSegmentType>("Top");
  // Use the custom hook to get the newsData from context
  const newsData = useNews();

  const newsSegmentValues: newsSegmentType[] = ["Top", "Local", "World"];

  const handleButtonClick = (segment: newsSegmentType) => {
    setCurrNewsSegment(segment);
  };
  //console.log(newsData);
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
            tertiary={true}
            onClick={() => handleButtonClick(segment)}
            active={currNewsSegment === segment}
          />
        ))}
      </div>
      <div>
        {/* Pass the newsData and currNewsSegment to the Article component */}
        <Articles articles={newsData} currNewsSegment={currNewsSegment} />
      </div>
    </div>
  );
};

export default News;

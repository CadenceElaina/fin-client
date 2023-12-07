import React from "react";
import { story, newsSegmentType } from "./types";
import "./news.css"; // Import your CSS file with the styles

interface StoryProps {
  stories: story[];
  currNewsSegment: newsSegmentType;
}

const Story: React.FC<StoryProps> = ({ stories, currNewsSegment }) => {
  // Filter stories based on the current segment
  const filteredStories = stories.filter((story) =>
    Array.isArray(story.segment)
      ? story.segment.includes(currNewsSegment)
      : story.segment === currNewsSegment
  );

  return (
    <div>
      {filteredStories.map((story) => (
        <div key={story.id} className="story-container">
          <div className="story-row">
            <div className="story-column">
              <div className="story-source-time">
                <div className="source">{story.source}</div>
                <div className="time">{story.time}</div>
              </div>
              <div className="title">{story.title}</div>
              <div className="related-symbol">{story.relatedSymbol}</div>
            </div>
            <div className="story-column-image">
              <img
                src={story.img}
                /* alt={story.title} */ className="story-image"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Story;

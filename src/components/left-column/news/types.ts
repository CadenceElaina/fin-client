export enum newsSegmentEnum {
  top = "Top",
  local = "Local",
  world = "World",
}

export type newsSegmentType = "Top" | "Local" | "World";

export interface story {
  id: string;
  source: string;
  time: string;
  title: string;
  relatedSymbol: string;
  img: string;
  segment: newsSegmentType | newsSegmentType[];
}

export interface storyProps {
  stories: story[];
  currNewsSegment: newsSegmentType;
}

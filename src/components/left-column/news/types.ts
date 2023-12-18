export enum newsSegmentEnum {
  top = "Top",
  local = "Local",
  world = "World",
}

export type newsSegmentType = "Top" | "Local" | "World";

export interface article {
  id?: string;
  link: string;
  source: string;
  time: string;
  title: string;
  relatedSymbol: string;
  img?: string;
  segment?: newsSegmentType | newsSegmentType[];
}

export interface articleProps {
  articles: article[];
  currNewsSegment?: newsSegmentType;
}

export interface credentials {
  username: string;
  password: string;
}
export type SnackbarType = "info" | "success" | "error" | "warning";
export interface Security {
  symbol: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
}

export interface Portfolio {
  id: string;
  title: string;
  author: string | undefined;
  securities?: Security[];
}

// News 
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

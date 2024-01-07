import { ReactNode } from "react";

/* import { User } from "../context/AuthContext"; */
export interface User {
  token: string;
  username: string;
  name?: string;
  portfolios?: Portfolio[];
}

export interface credentials {
  username: string;
  password: string;
}
export interface UserCredentials extends credentials {
  name: string;
}
export type SnackbarType = "info" | "success" | "error" | "warning";
export interface Security {
  selected?: boolean;
  symbol: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
}
export interface WatchlistSecurity {
  [x: string]: ReactNode;
  selected?: boolean;
  symbol: string;
  name?: string;
  price?: number;
  priceChange?: number;
  percentChange?: number;
}
export type MostFollowedSecurityWithoutDetails = Omit<
  Security,
  "purchaseDate" | "purchasePrice" | "quantity"
>;
export interface MostFollowedSecurities {
  symbol: string;
  name: string;
  followers: number;
  price?: number;
  priceChange?: number;
  percentChange?: number;
}
export interface Portfolio {
  id: string;
  title: string;
  author: string | undefined;
  securities?: Security[];
}
export interface Watchlist {
  id: string;
  title: string;
  author: string | undefined;
  securities?: WatchlistSecurity[];
  selected?: boolean;
}
export interface Watchlists {
  id: string;
  title: string;
  securities: MostFollowedSecurities[] | undefined;
  author: string;
  user?: User;
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
  symbol?: string;
}

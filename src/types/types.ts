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

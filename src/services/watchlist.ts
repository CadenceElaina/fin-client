// watchlist.ts
import axios from "axios";
import { WatchlistSecurity } from "../types/types";
const baseUrl = "/api/watchlists";
let token: string | null = null;

interface newWatchlist {
  title: string;
  user?: string;
}

/* interface Security {
  symbol: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
}
 */
const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject: newWatchlist) => {
  const storedUserString = localStorage.getItem("loggedFinanceappUser") || "{}";
  const storedUserData = JSON.parse(storedUserString);
  const token = storedUserData.token || "";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const addToWatchlist = async (id: string, security: WatchlistSecurity) => {
  const response = await axios.post(`${baseUrl}/${id}/securities`, {
    security,
  });
  return response.data;
};

const removeSecurityFromWatchlist = async (
  id: string,
  security: WatchlistSecurity
) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  console.log(id);
  console.log(token);
  try {
    const response = await axios.delete(
      `${baseUrl}/${id}/securities/${security.symbol}`,
      config
    );

    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.error("Error removing security:", error);
    throw error;
  }
};
const remove = async (id: string) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log("DELETE Request Config:", config);
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};
export default {
  setToken,
  getAll,
  create,
  addToWatchlist,
  removeSecurityFromWatchlist,
  remove,
};

import axios from "axios";
const baseUrl = "/api/portfolios";
let token: string | null = null;

interface newPortfolio {
  title: string;
  user?: string;
}
interface Security {
  symbol: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
}

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject: newPortfolio) => {
  const storedUserString = localStorage.getItem("loggedFinanceappUser") || "{}";
  const storedUserData = JSON.parse(storedUserString);
  const token = storedUserData.token || "";
  /* console.log(token); */
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const addToPortfolio = async (id: string, security: Security) => {
  const response = await axios.post(`${baseUrl}/${id}/securities`, {
    security,
  });
  return response.data;
};

const remove = async (id: string) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const updatePortfolioValue = async (portfolioId: string, data: any) => {
  const response = await axios.put(`${baseUrl}/${portfolioId}`, data);
  return response; // Return the entire response object
};

export default {
  setToken,
  getAll,
  create,
  addToPortfolio,
  remove,
  updatePortfolioValue,
};
/*

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};
*/

/* const likeBlog = async (id, portfolio) => {
  const response = await axios.put(`${baseUrl}/${id}`, portfolio);
  return response.data;
}; */
/* 
const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment });
  return response.data;
}; */
/* const addSecurity = async (id, security) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { security });
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};


export default {
  setToken,
  getAll,
  create,

  remove,
  addSecurity,
};
 */

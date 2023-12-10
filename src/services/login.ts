import axios from "axios";
import { credentials } from "../types/types";
const baseUrl = "/api/login";

const login = async (credentials: credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };

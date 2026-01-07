const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

const api = axios.create({
  baseURL: `${BACKEND_URL}`,
  withCredentials: true, //
});

export default api;
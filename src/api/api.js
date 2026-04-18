import axios from "axios";

const API_KEY = "ad39735f1449a6dc28d60e0921352665";

const api = axios.create({
  baseURL: "https://api.jotform.com",
  timeout: 10000,
  headers: {
    APIKEY: API_KEY,
  },
});

export default api;

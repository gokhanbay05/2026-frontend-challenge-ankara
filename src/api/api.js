import axios from "axios";

const API_KEY = "5593acd695caab1a3805c3af8532df09";

const api = axios.create({
  baseURL: "https://api.jotform.com",
  timeout: 10000,
  params: {
    apiKey: API_KEY,
  },
});

export default api;

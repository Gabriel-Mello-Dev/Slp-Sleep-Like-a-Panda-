import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BACKEND ?? 'http://localhost:3000',
});

export { api };

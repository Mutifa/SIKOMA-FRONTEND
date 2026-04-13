import api from "../lib/api";

export const homeService = {
  get: () => api.get("/home"),
};
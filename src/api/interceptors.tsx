import api from "./axios";
import store from "../redux/Store";
import { jwtTokenAction } from "../redux/reducer/AuthReducer";


api.interceptors.request.use((config) => {
  const token = store.getState().auth.jwtToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/api/refreshToken");
        const newToken = res.data.accessToken;

        store.dispatch(jwtTokenAction(newToken));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        store.dispatch(jwtTokenAction(null));
      }
    }

    return Promise.reject(error);
  }
);

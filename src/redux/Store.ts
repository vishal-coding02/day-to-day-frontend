import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./reducer/AuthReducer";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;

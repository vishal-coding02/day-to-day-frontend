import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  userData: [],
  loading: false,
  jwtToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupAction: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    loginAction(state, action) {
      state.userData = action.payload;
      state.loading = true;
    },
    jwtTokenAction(state, action) {
      state.jwtToken = action.payload;
      state.loading = true;
    },
  },
});

export const { signupAction, loginAction, jwtTokenAction } = authSlice.actions;
export default authSlice.reducer;

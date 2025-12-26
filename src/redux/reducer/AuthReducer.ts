import { createSlice } from "@reduxjs/toolkit";
interface AuthState {
  userData: string[];
  loading: boolean;
  jwtToken: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
}

const initialState: AuthState = {
  userData: [],
  loading: true,
  jwtToken: null,
  isAuthenticated: false,
  isAuthReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupAction: (state, action) => {
      state.userData = action.payload;
    },

    loginAction(state, action) {
      state.userData = action.payload;
      state.loading = true;
    },

    jwtTokenAction(state, action) {
      state.jwtToken = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.isAuthReady = true;
    },

    logout(state) {
      state.jwtToken = null;
      state.userData = [];
      state.isAuthenticated = false;
      state.loading = false;
      state.isAuthReady = true;
    },
  },
});

export const { signupAction, loginAction, jwtTokenAction, logout } =
  authSlice.actions;
export default authSlice.reducer;

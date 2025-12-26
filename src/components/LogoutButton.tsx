import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import api from "../api/axios";
import { logout } from "../redux/reducer/AuthReducer";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(
        "/users/logout",
        {},
        { withCredentials: true }
      );
    } finally {
      dispatch(logout());
      localStorage.removeItem("userID");
      localStorage.removeItem("userType");
      localStorage.removeItem("providerStatus");
      navigate("/login");
    }
  };

  return handleLogout;
};

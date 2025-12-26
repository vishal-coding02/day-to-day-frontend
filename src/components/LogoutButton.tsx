import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/reducer/AuthReducer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/users/logout`,
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

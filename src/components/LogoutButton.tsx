import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import api from "../api/axios";
import { logout } from "../redux/reducer/AuthReducer";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post(
        "/users/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(logout());
        localStorage.removeItem("userID");
        localStorage.removeItem("userType");
        localStorage.removeItem("providerStatus");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return handleLogout;
};

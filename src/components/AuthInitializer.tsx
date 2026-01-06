import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { jwtTokenAction } from "../redux/reducer/AuthReducer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/refreshToken`,
          {},
          { withCredentials: true }
        );

        dispatch(jwtTokenAction(res.data.accessToken));
      } catch {
        dispatch(jwtTokenAction(null));
      }
    };

    restoreSession();
  }, []);


  return <>{children}</>;
};

export default AuthInitializer;

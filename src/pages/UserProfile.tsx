import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { jwtTokenAction } from "../redux/reducer/AuthReducer";
import type UserProfile from "../interfaces/UserProfileInterface";

const PROFILE_API_URL = import.meta.env.VITE_PROFILE_API_URL;
// const REFRESHTOKEN = import.meta.env.VITE_REFRESHTOKEN;

const Profile = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      let currentToken = token;
      console.log("Initial token:", currentToken);
      try {
        const res = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken || accessToken}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Profile response:", data);
        setUserData(data);
      } catch (err: any) {
        console.log("Profile fetch error:", err.message);
      }
    };

    fetchData();
  }, [token, dispatch]);

  return (
    <div>
      <h2>User Profile</h2>
      <p>{userData?.message}</p>
      <p>Name: {userData?.name}</p>
    </div>
  );
};

export default Profile;

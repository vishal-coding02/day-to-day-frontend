import { useState } from "react";
import type LoginForm from "../interfaces/LoginInterface";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { jwtTokenAction, loginAction } from "../redux/reducer/AuthReducer";
import api from "../api/axios.js";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState<LoginForm>({
    phone: "",
    password: "",
    email: "",
  });

  const [loginType, setLoginType] = useState<"phone" | "email">("phone");
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    email: "",
    general: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
        general: "",
      });
    }
  };

  const toggleLoginType = () => {
    setLoginType(loginType === "phone" ? "email" : "phone");
    setErrors({ phone: "", password: "", email: "", general: "" });
  };

  const validateForm = () => {
    const newErrors = { phone: "", password: "", email: "", general: "" };

    if (loginType === "phone" && !loginData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (loginType === "email" && !loginData.email) {
      newErrors.email = "Email is required";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.phone && !newErrors.password && !newErrors.email;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const requestData = {
      password: loginData.password,
      [loginType]: loginData[loginType],
    };

    console.log("Sending login data:", requestData);

    try {
      const res = await api.post("/auth/login", requestData);

      const data = res.data;
      console.log("Login success:");

      dispatch(jwtTokenAction(data.accessToken));
      dispatch(loginAction(data));

      localStorage.setItem("providerStatus", data.providerStatus);
      localStorage.setItem("userID", data.userID);
      localStorage.setItem("userType", data.userType);

      if (data.userType === "customer") {
        navigate("/postRequirement");
      } else if (
        data.providerStatus === "pending" &&
        data.userType === "provider"
      ) {
        navigate(`/providerReviews/${data.userID}`);
      } else if (data.userType === "admin") {
        navigate("/adminDashBoard");
      } else if (
        data.providerStatus === "reject" &&
        data.userType === "provider"
      ) {
        navigate("/rejectedProvider");
      } else if (
        data.providerStatus === "approved" &&
        data.userType === "provider"
      ) {
        navigate("/providerDashBoard");
      }

      setErrors({ phone: "", password: "", email: "", general: "" });
      setLoginData({ phone: "", password: "", email: "" });
    } catch (err: any) {
      console.log("Login error:", err);

      setErrors((prev) => ({
        ...prev,
        general:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed",
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
          {/* Form Header */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
            <p className="text-center opacity-90 mt-2">
              Sign in to access your account
            </p>
          </div>

          {/* Login Form */}
          <div className="p-6">
            <form
              className="space-y-4"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              {/* Login Type Toggle */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    type="button"
                    onClick={toggleLoginType}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      loginType === "phone"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Phone Login
                  </button>
                  <button
                    type="button"
                    onClick={toggleLoginType}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      loginType === "email"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Email Login
                  </button>
                </div>
              </div>

              {/* Dynamic Input Field */}
              <div>
                <label
                  htmlFor={loginType}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {loginType === "phone" ? "Phone Number" : "Email Address"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loginType === "phone" ? (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    )}
                  </div>
                  <input
                    id={loginType}
                    name={loginType}
                    type={loginType === "phone" ? "tel" : "email"}
                    value={loginData[loginType] || ""}
                    onChange={handleInputChange}
                    placeholder={
                      loginType === "phone"
                        ? "Enter your phone number"
                        : "Enter your email address"
                    }
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                </div>
                {errors[loginType] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[loginType]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <span
                    onClick={() => navigate("/forgotPassword")}
                    className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                  >
                    Forgot password?
                  </span>
                </div>
              </div>

              {/* General Error Message */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

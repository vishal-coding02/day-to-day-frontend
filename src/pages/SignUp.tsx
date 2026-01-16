import { useState } from "react";
import type SignUpForm from "../interfaces/SignUpInterface";
import { useDispatch } from "react-redux";
import { signupAction } from "../redux/reducer/AuthReducer";
import { useNavigate } from "react-router";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import api from "../api/axios";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = useState<SignUpForm>({
    name: "",
    phone: 0,
    userType: "customer",
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (): Promise<void> => {
    if (
      !users.name.trim() ||
      !users.email.trim() ||
      !users.password.trim() ||
      !users.phone
    ) {
      alert("All fields are required");
      return;
    }

    const payload = {
      name: users.name.trim(),
      email: users.email.trim(),
      password: users.password,
      phone: String(users.phone),
      userType: users.userType,
    };

    console.log("Signup Payload:", payload);

    try {
      const res = await api.post("/auth/signUp", payload);

      const data = res.data;
      console.log("User created:", data);

      dispatch(
        signupAction({
          ...payload,
          userId: data.userId,
          type: data.type,
        })
      );

      navigate("/otpVerification");

      // RESET FORM
      setUsers({
        name: "",
        phone: 0,
        userType: "customer",
        password: "",
        email: "",
      });
    } catch (err: any) {
      console.log("Signup Error:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl flex">
          {/* Left side - Illustration */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex-col justify-center items-center text-white">
            <div className="w-full max-w-xs">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Find the Best Local Services
                </h2>
                <p className="text-blue-100">
                  Join thousands of users who find trusted service providers in
                  their area.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      ></path>
                    </svg>
                  </div>
                  <span>Find trusted local professionals</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <span>Verified reviews and ratings</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span>Secure and easy payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 py-8 px-6 md:px-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join our community of service providers and customers
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
              }}
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
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
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsers({ ...users, name: e.target.value });
                    }}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsers({ ...users, phone: Number(e.target.value) });
                    }}
                    placeholder="Enter your phone number"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.94 6.34A2 2 0 0 1 4.5 6h11a2 2 0 0 1 1.56.34l-6.06 4.55a2 2 0 0 1-2.5 0L2.94 6.34z" />
                      <path d="M18 8.67v5.83A2.5 2.5 0 0 1 15.5 17h-11A2.5 2.5 0 0 1 2 14.5V8.67l6.47 4.85a4 4 0 0 0 4.94 0L18 8.67z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsers({ ...users, email: e.target.value });
                    }}
                    placeholder="Enter your email"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    required
                  />
                </div>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsers({ ...users, password: e.target.value });
                    }}
                    placeholder="Create a strong password"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a
                </label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="customer"
                      name="userType"
                      type="radio"
                      value="customer"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUsers({ ...users, userType: e.target.value });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      defaultChecked
                      required
                    />
                    <label
                      htmlFor="customer"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Customer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="provider"
                      name="userType"
                      type="radio"
                      value="provider"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUsers({ ...users, userType: e.target.value });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      required
                    />
                    <label
                      htmlFor="provider"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Service Provider
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSignUp}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium"
                >
                  Create Account
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </a>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.317 4.162a5.25 5.25 0 016.521 0 5.25 5.25 0 01-1.353 8.51 5.25 5.25 0 01-1.742-.963 5.25 5.25 0 01-1.742.963 5.25 5.25 0 01-1.353-8.51zm-1.174 6.558a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.657 16.243l-1.414 1.414C12.146 19.098 10.9 19.5 10 19.5s-2.146-.402-3.243-1.843l-1.414-1.414C3.902 14.146 3.5 12.9 3.5 12s.402-2.146 1.843-3.243l1.414-1.414C7.854 5.902 9.1 5.5 10 5.5s2.146.402 3.243 1.843l1.414 1.414C16.098 9.854 16.5 11.1 16.5 12s-.402 2.146-1.843 3.243z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;

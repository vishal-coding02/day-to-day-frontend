import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Shield, Home } from "lucide-react";
import { Link } from "react-router-dom"; // Or your navigation method

const PasswordResetSuccess = () => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "/login";
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#dee2e6] p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Password Changed Successfully!
          </h1>

          <p className="text-gray-600 mb-6">
            Your password has been updated successfully. You can now sign in
            with your new password.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Login Button */}
            <Link to="/login">
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center group cursor-pointer">
                <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Go to Login Page
                {countdown > 0 && (
                  <span className="ml-2 text-green-200">({countdown}s)</span>
                )}
              </button>
            </Link>

            {/* Home Button */}
            <Link to="/">
              <button className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all flex items-center justify-center cursor-pointer">
                <Home className="w-5 h-5 mr-2 " />
                Go to Homepage
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;

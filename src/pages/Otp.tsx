import { useState } from "react";
import { useNavigate } from "react-router";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      e.currentTarget.previousSibling
    ) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpVerification = () => {
    const otpValue = otp.join("");
    console.log("Sent OTP:", otpValue); // Check yeh value
    console.log("Sent OTP Type:", typeof otpValue); // Ensure string hai
    fetch(`${BACKEND_URL}/verifyOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otpValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage(data.message);
          setErrorMessage("");
          navigate("/address");
        } else {
          setErrorMessage(data.message || "Invalid OTP");
          setSuccessMessage("");
        }
      })
      .catch((err) => {
        console.log("Error:", err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold text-center">
            Verify Your Account
          </h1>
          <p className="text-center opacity-90 mt-2">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        {/* OTP Form */}
        <div className="p-8">
          <div className="text-center mb-2">
            <div className="flex justify-center items-center space-x-2 mb-6">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={data}
                  onChange={(e) =>
                    handleChange(e.target as HTMLInputElement, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold focus:border-blue-500 focus:outline-none transition-colors"
                />
              ))}
            </div>

            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium mb-6"
              onClick={handleOtpVerification}
            >
              Verify OTP
            </button>

            <div className="text-center text-sm text-gray-600">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 mt-1"
              >
                Resend OTP
              </button>
            </div>
          </div>

          {/* Success Message (Example) */}
          {successMessage && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message (Example) */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

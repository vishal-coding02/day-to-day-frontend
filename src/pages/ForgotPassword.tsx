import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import {
  Phone,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Clock,
  Search,
  Shield,
  CheckCircle,
  Send,
  AlertCircle,
} from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState<"search" | "sendOtp" | "verify" | "reset">(
    "search"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [maskedPhone, setMaskedPhone] = useState("");
  const [timer, setTimer] = useState(120);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isProfileFound, setIsProfileFound] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState([
    {
      id: 1,
      text: "8-16 characters",
      regex: /^.{8,16}$/,
      met: false,
      icon: null,
    },
    {
      id: 2,
      text: "Uppercase letter (A-Z)",
      regex: /[A-Z]/,
      met: false,
      icon: null,
    },
    {
      id: 3,
      text: "Lowercase letter (a-z)",
      regex: /[a-z]/,
      met: false,
      icon: null,
    },
    {
      id: 4,
      text: "Number (0-9)",
      regex: /\d/,
      met: false,
      icon: null,
    },
    {
      id: 5,
      text: "Special character (!@#$%^&*)",
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      met: false,
      icon: null,
    },
  ]);

  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    color: "#ef4444",
    label: "Very Weak",
    progress: 0,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "verify" && timer > 0 && otpSent) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer, otpSent]);

  useEffect(() => {
    if (!newPassword) {
      setPasswordRequirements((prev) =>
        prev.map((req) => ({ ...req, met: false }))
      );
      setPasswordStrength({
        level: 0,
        color: "#ef4444",
        label: "Very Weak",
        progress: 0,
      });
      return;
    }

    const updatedRequirements = passwordRequirements.map((req) => ({
      ...req,
      met: req.regex.test(newPassword),
    }));

    const metCount = updatedRequirements.filter((req) => req.met).length;
    const totalCount = passwordRequirements.length;

    let level = 0;
    let color = "#ef4444";
    let label = "Very Weak";
    let progress = (metCount / totalCount) * 100;

    if (metCount === totalCount) {
      level = 4;
      color = "#10b981";
      label = "Very Strong";
    } else if (metCount >= 4) {
      level = 3;
      color = "#3b82f6";
      label = "Strong";
    } else if (metCount >= 3) {
      level = 2;
      color = "#f59e0b";
      label = "Good";
    } else if (metCount >= 1) {
      level = 1;
      color = "#f97316";
      label = "Weak";
    }

    setPasswordRequirements(updatedRequirements);
    setPasswordStrength({
      level,
      color,
      label,
      progress,
    });
  }, [newPassword]);

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length < 10) {
      alert("Please enter 10 digit phone number");
      return;
    }

    try {
      const res = await api.get("/auth/search-user", {
        params: { phone: phoneNumber },
      });

      const data = res.data;
      if (data.data) {
        setUserData(data.data);
        setAuthUserId(res.data.authUserId);
        setIsProfileFound(true);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setIsProfileFound(false);
      setUserData(null);
      alert(message);
    }
  };

  const handleProfileClick = () => {
    if (isProfileFound && userData) {
      const lastFiveDigits = phoneNumber.slice(-5);
      const masked = "******" + lastFiveDigits;
      setMaskedPhone(masked);
      setStep("sendOtp");
    }
  };

  const sendOtp = async () => {
    try {
      const res = await api.post("/send-otp", {
        id: authUserId,
        purpose: "PASSWORD_RESET",
      });

      const data = res.data;

      setOtpSent(true);
      console.log("Otp sent ", data.message);
      setTimer(data.expiry);
      setOtp(["", "", "", "", "", ""]);
      setStep("verify");
    } catch (err: any) {
      console.log("OTP send error:", err.response?.data?.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      try {
        await api.post("/verifyEmail", {
          otp: enteredOtp,
          purpose: "PASSWORD_RESET",
        });
        setStep("reset");
      } catch (err: any) {
        console.log("OTP verification error:", err.response?.data?.error);
        alert("Invalid OTP. Please try again.");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all requirements are met
    const allMet = passwordRequirements.every((req) => req.met);
    if (!allMet) {
      alert("Please meet all password requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        phone: phoneNumber,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      console.log("Password reset message :", res.data.message);
      window.location.href = "/password-reset-success";
    } catch (err: any) {
      console.log("Full error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password";
      alert(msg);
    }
  };

  const handleBack = () => {
    if (step === "sendOtp") {
      setStep("search");
    } else if (step === "verify") {
      setStep("sendOtp");
      setOtpSent(false);
      setTimer(120);
    } else if (step === "reset") {
      setStep("verify");
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleResendOtp = () => {
    if (timer === 0 || !otpSent) {
      sendOtp();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if all requirements are met
  const isAllRequirementsMet = passwordRequirements.every((req) => req.met);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#dee2e6] p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Recovery
          </h1>
          <p className="text-gray-600">
            {step === "search"
              ? "Find your account to reset password"
              : step === "sendOtp"
              ? "Verify your account"
              : step === "verify"
              ? "Enter OTP to verify"
              : "Set your new password"}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          {/* Step 1: Search Account */}
          {step === "search" && (
            <form onSubmit={handlePhoneSearch}>
              <div className="mb-6">
                <label className="text-gray-700 text-sm font-medium mb-2 flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Search by Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter your phone number"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                Search Account
              </button>

              {isProfileFound && userData && (
                <div className="mt-6 animate-fadeIn">
                  <p className="text-gray-600 text-sm mb-3">Found account:</p>
                  <div
                    onClick={handleProfileClick}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={userData.providerImageUrl || "user"}
                        alt={userData.userName || "User"}
                        className="w-14 h-14 rounded-full border-2 border-blue-500 group-hover:border-blue-600"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-gray-900 font-semibold">
                            {userData.userName ||
                              userData.providerName ||
                              "User"}
                          </h3>
                        </div>
                        <div className="text-blue-600">
                          <ArrowLeft className="w-5 h-5 transform rotate-180" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-2">
                        Click to verify and continue
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Step 2: Send OTP Confirmation */}
          {step === "sendOtp" && userData && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="mb-8 text-center">
                <img
                  src={userData.providerImageUrl}
                  alt={userData.userName || userData.providerName}
                  className="w-16 h-16 rounded-full border-3 border-blue-500 mx-auto mb-4"
                />
                <h3 className="text-gray-900 text-lg font-semibold">
                  {userData.userName || userData.providerName}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Phone:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {maskedPhone}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-center mb-6">
                  We'll send a 6-digit OTP to your email for verification
                </p>

                <button
                  onClick={sendOtp}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send OTP
                </button>
              </div>

              <button
                onClick={handleBack}
                className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
              >
                Back to Search
              </button>
            </div>
          )}

          {/* Step 3: Verify OTP */}
          {step === "verify" && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="mb-8 text-center">
                {userData && (
                  <img
                    src={userData.providerImageUrl}
                    alt={userData?.userName || userData.providerName}
                    className="w-14 h-14 rounded-full border-3 border-blue-500 mx-auto mb-3"
                  />
                )}
                <h3 className="text-gray-900 text-lg font-semibold">
                  {userData?.userName || userData.providerName}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  OTP sent to:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {maskedPhone}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-3 text-center">
                  Enter 6-digit OTP
                </label>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>

                <div className="text-center mb-6 space-y-3">
                  <div className="flex items-center justify-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">OTP expires in: </span>
                    <span
                      className={`font-mono ml-2 ${
                        timer < 30
                          ? "text-red-600"
                          : timer < 60
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatTime(timer)}
                    </span>
                  </div>

                  <button
                    onClick={handleResendOtp}
                    disabled={timer > 0 && otpSent}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      timer > 0 && otpSent
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {timer > 0 && otpSent
                      ? `Resend OTP in ${formatTime(timer)}`
                      : "Resend OTP"}
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.some((digit) => digit === "")}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    otp.some((digit) => digit === "")
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  Verify OTP
                </button>
              </div>

              <button
                onClick={handleBack}
                className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 4: Reset Password - MODERN UI */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-8 text-center">
                <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full inline-flex mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-gray-900 text-xl font-semibold">
                  Set New Password
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Create a strong password to secure your account
                </p>
              </div>

              <div className="mb-6 space-y-5">
                {/* New Password Field */}
                <div className="space-y-3">
                  <label className="block text-gray-700 text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      minLength={8}
                      maxLength={16}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Modern Strength Indicator */}
                {newPassword && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Password Strength
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Progress Bar with Steps */}
                    <div className="relative">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 rounded-full"
                          style={{
                            width: `${passwordStrength.progress}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Password Field */}
                <div className="space-y-3">
                  <label className="block text-gray-700 text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      minLength={8}
                      maxLength={16}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword && newPassword && (
                    <div
                      className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                        newPassword === confirmPassword
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle size={16} />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} />
                          <span>Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={
                    !isAllRequirementsMet ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                  className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    !isAllRequirementsMet ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  <Lock size={18} />
                  Reset Password
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-all border border-gray-300"
                >
                  Back to OTP Verification
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium inline-flex items-center gap-1"
            >
              Sign in instead
              <ArrowLeft className="w-4 h-4 transform rotate-180" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

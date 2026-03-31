import { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import api from "../api/axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BuyCoins = () => {
  const [coinAmount, setCoinAmount] = useState<string>("");
  const [userData, setUserData] = useState({
    userName: "",
    userPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const showNotification = (
    type: "success" | "error" | "info",
    message: string,
  ) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  const COIN_PRICE = 1;
  const totalPrice = coinAmount ? parseInt(coinAmount) * COIN_PRICE : 0;

  const handleBuyCoins = async () => {
    if (!coinAmount || parseInt(coinAmount) <= 0) {
      showNotification("error", "Please enter a valid coin amount");
      return;
    }

    if (!userData.userName || !userData.userPhone) {
      showNotification("error", "Please fill in all your details");
      return;
    }

    setLoading(true);

    try {
      const { data: orderData } = await api.post("/createCoinOrder", {
        name: userData.userName,
        phone: userData.userPhone,
        coins: parseInt(coinAmount),
      });

      if (!orderData.success) {
        showNotification(
          "error",
          "Failed to create order: " + orderData.message,
        );
        setLoading(false);
        return;
      }
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: "INR",
        name: "Coins Purchase",
        description: `${coinAmount} Coins`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const { data: verifyData } = await api.post("/verifyPayment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name: userData.userName,
              phone: userData.userPhone,
              coins: parseInt(coinAmount),
              price: totalPrice,
            });

            if (verifyData.success) {
              showNotification(
                "success",
                `${coinAmount} coins added to your account!`,
              );
              setCoinAmount("");
              setUserData({ userName: "", userPhone: "" });
            } else {
              showNotification(
                "error",
                "Payment verification failed: " + verifyData.message,
              );
            }
          } catch (err) {
            console.error("Verify Error:", err);
            showNotification(
              "error",
              "Payment verification error. Contact support.",
            );
          }
        },
        prefill: {
          name: userData.userName,
          contact: userData.userPhone,
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        showNotification(
          "error",
          "Payment failed: " + response.error.description,
        );
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Buy Coins Error:", err);
      showNotification(
        "error",
        "Something went wrong while initiating payment.",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Custom Notification Popup */}
      {notification.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[320px] max-w-md ${
              notification.type === "success"
                ? "bg-green-50 border-l-4 border-green-500"
                : notification.type === "error"
                  ? "bg-red-50 border-l-4 border-red-500"
                  : "bg-blue-50 border-l-4 border-blue-500"
            }`}
          >
            <div>
              {notification.type === "success" && (
                <i className="fas fa-check-circle text-green-500 text-xl"></i>
              )}
              {notification.type === "error" && (
                <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
              )}
              {notification.type === "info" && (
                <i className="fas fa-info-circle text-blue-500 text-xl"></i>
              )}
            </div>
            <p
              className={`flex-1 text-sm font-medium ${
                notification.type === "success"
                  ? "text-green-800"
                  : notification.type === "error"
                    ? "text-red-800"
                    : "text-blue-800"
              }`}
            >
              {notification.message}
            </p>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Buy Coins</h1>
            <p className="text-gray-600 text-lg">
              Purchase coins to book services on our platform
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
            {/* User Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-user-circle mr-2 text-indigo-600"></i>
                Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="userPhone"
                    value={userData.userPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Coin Amount Input */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-coins mr-2 text-indigo-600"></i>
                Enter Coin Amount
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                1 Coin = ₹{COIN_PRICE}
              </p>
              <input
                type="number"
                min="1"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. 100"
              />
            </div>

            {/* Order Summary */}
            {coinAmount && parseInt(coinAmount) > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Order Summary
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Coins:</span>
                  <span className="font-medium">
                    <i className="fas fa-coins text-yellow-500 mr-1"></i>
                    {coinAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-800 font-bold">Total:</span>
                  <span className="text-xl font-bold text-indigo-600">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            )}

            {/* Buy Button */}
            <button
              onClick={handleBuyCoins}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-lg font-bold text-lg shadow-md transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock mr-2"></i>
                  Pay with Razorpay
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your payment is secure and encrypted. By completing this purchase,
              you agree to our Terms of Service.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: "What can I use coins for?",
                  a: "Coins can be used to book services, access premium features, and purchase exclusive deals on our platform.",
                },
                {
                  q: "Do coins expire?",
                  a: "No, your coins never expire. They remain in your account until you use them.",
                },
                {
                  q: "Can I get a refund?",
                  a: "Coin purchases are non-refundable. However, unused coins can be transferred to another account.",
                },
                {
                  q: "How soon will I receive my coins?",
                  a: "Coins are added to your account immediately after successful payment.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <i className="fas fa-question-circle text-indigo-600 mr-2"></i>
                    {faq.q}
                  </h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BuyCoins;

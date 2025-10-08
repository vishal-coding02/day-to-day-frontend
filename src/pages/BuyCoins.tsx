import { useState } from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
const BUY_COINS_URL = import.meta.env.VITE_BUY_COINS_URL;

const BuyCoins = () => {
  const token = useSelector((state: any) => state.auth.jwtToken);
  const accessToken = localStorage.getItem("accessToken");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    userName: "",
    userPhone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const coinPackages = [
    {
      id: "package-1",
      name: "Starter Pack",
      coins: 100,
      price: 499,
      popular: false,
    },
    {
      id: "package-2",
      name: "Value Pack",
      coins: 250,
      price: 999,
      popular: true,
    },
    {
      id: "package-3",
      name: "Pro Pack",
      coins: 500,
      price: 1799,
      popular: false,
    },
    {
      id: "package-4",
      name: "Mega Pack",
      coins: 1000,
      price: 2999,
      popular: false,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleBuyCoins = async () => {
    if (!selectedPackage) {
      alert("Please select a coin package");
      return;
    }

    if (!userData.userName || !userData.userPhone) {
      alert("Please fill in all your details");
      return;
    }

    const selectedPkg = coinPackages.find((pkg) => pkg.id === selectedPackage);
    if (!selectedPkg) return;

    try {
      const response = await fetch(BUY_COINS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || accessToken}`,
        },
        body: JSON.stringify({
          name: userData.userName,
          phone: userData.userPhone,
          packageID: selectedPkg.id,
          packageName: selectedPkg.name,
          coins: selectedPkg.coins,
          price: selectedPkg.price,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Coins purchased :", data.message);
        alert(`${selectedPkg.coins} coins purchased successfully!`);
      } else {
        alert(`Purchase failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Buy Coins Error:", err);
      alert("Something went wrong while purchasing coins.");
    } finally {
      // Reset form
      setSelectedPackage(null);
      setUserData({ userName: "", userPhone: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Buy Coins</h1>
            <p className="text-gray-600 text-lg">
              Purchase coins to book services on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Details Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
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
                    required
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
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <i className="fas fa-credit-card mr-2 text-indigo-600"></i>
                  Payment Method
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                      paymentMethod === "card"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <i className="fas fa-credit-card text-2xl mb-2 text-gray-700"></i>
                    <p className="font-medium">Credit/Debit Card</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                      paymentMethod === "upi"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <i className="fas fa-mobile-alt text-2xl mb-2 text-gray-700"></i>
                    <p className="font-medium">UPI</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                      paymentMethod === "netbanking"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("netbanking")}
                  >
                    <i className="fas fa-university text-2xl mb-2 text-gray-700"></i>
                    <p className="font-medium">Net Banking</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                      paymentMethod === "wallet"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("wallet")}
                  >
                    <i className="fas fa-wallet text-2xl mb-2 text-gray-700"></i>
                    <p className="font-medium">Wallet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coin Packages */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-coins mr-2 text-indigo-600"></i>
                Select Coin Package
              </h2>

              <div className="space-y-4">
                {coinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-indigo-300"
                    } ${
                      pkg.popular
                        ? "ring-2 ring-yellow-400 ring-opacity-50"
                        : ""
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-600">
                          <i className="fas fa-coins text-yellow-500 mr-1"></i>
                          {pkg.coins} coins
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-indigo-600">
                          ₹{pkg.price}
                        </div>
                        {pkg.popular && (
                          <div className="text-sm text-green-600 font-medium">
                            Best Value
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              {selectedPackage && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Order Summary
                  </h3>

                  {coinPackages
                    .filter((pkg) => pkg.id === selectedPackage)
                    .map((pkg) => (
                      <div key={pkg.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium">{pkg.name}</span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Coins:</span>
                          <span className="font-medium">
                            <i className="fas fa-coins text-yellow-500 mr-1"></i>
                            {pkg.coins}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-bold text-indigo-600">
                            ₹{pkg.price}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                          <span className="text-gray-800 font-bold">
                            Total:
                          </span>
                          <span className="text-xl font-bold text-indigo-600">
                            ₹{pkg.price}
                          </span>
                        </div>
                      </div>
                    ))}

                  <button
                    onClick={handleBuyCoins}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg shadow-md transition-colors flex items-center justify-center mt-6"
                  >
                    <i className="fas fa-lock mr-2"></i>
                    Buy Now
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Your payment is secure and encrypted. By completing this
                    purchase, you agree to our Terms of Service.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-question-circle text-indigo-600 mr-2"></i>
                  What can I use coins for?
                </h3>
                <p className="text-gray-600">
                  Coins can be used to book services, access premium features,
                  and purchase exclusive deals on our platform.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-question-circle text-indigo-600 mr-2"></i>
                  Do coins expire?
                </h3>
                <p className="text-gray-600">
                  No, your coins never expire. They remain in your account until
                  you use them for services.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-question-circle text-indigo-600 mr-2"></i>
                  Can I get a refund?
                </h3>
                <p className="text-gray-600">
                  Coin purchases are non-refundable. However, unused coins can
                  be transferred to another account.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-question-circle text-indigo-600 mr-2"></i>
                  How soon will I receive my coins?
                </h3>
                <p className="text-gray-600">
                  Coins are added to your account immediately after successful
                  payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyCoins;

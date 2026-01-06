import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import api from "../api/axios";

const ProviderHomePage = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);
  const userID = localStorage.getItem("userID");
  const [userCoins, setUserCoins] = useState(0);
  const [activeRequests, setActiveRequests] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for available service requests
  const serviceRequests = [
    {
      id: 1,
      customerName: "Rohan Kumar",
      location: "Delhi",
      service: "Plumbing & Carpentry",
      description:
        "I need a repair and plumber for bathroom leakage and cupboard repair",
      price: "₹700",
      postedTime: "2 hours ago",
      urgency: "High",
    },
    {
      id: 2,
      customerName: "Priya Sharma",
      location: "Mumbai",
      service: "Electrical Work",
      description: "Complete house wiring needed for new apartment",
      price: "₹2,500",
      postedTime: "5 hours ago",
      urgency: "Medium",
    },
    {
      id: 3,
      customerName: "Amit Patel",
      location: "Bangalore",
      service: "AC Repair",
      description: "AC not cooling properly, needs gas refill and servicing",
      price: "₹1,200",
      postedTime: "1 hour ago",
      urgency: "High",
    },
    {
      id: 4,
      customerName: "Neha Singh",
      location: "Delhi",
      service: "Painting Work",
      description: "2 BHK apartment painting needed with waterproofing",
      price: "₹8,000",
      postedTime: "3 hours ago",
      urgency: "Low",
    },
  ];

  // Provider stats
  const providerStats = [
    {
      label: "Available Coins",
      value: userCoins,
      icon: "🪙",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
    },
    {
      label: "Active Requests",
      value: activeRequests,
      icon: "📋",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      label: "Completed Jobs",
      value: completedJobs,
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      label: "Total Earnings",
      value: `₹${earnings}`,
      icon: "💰",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
    },
  ];

  // Features for providers
  const providerFeatures = [
    {
      icon: "👥",
      title: "Get More Customers",
      description: "Access thousands of service requests in your area",
    },
    {
      icon: "💸",
      title: "Earn More Money",
      description: "Set your own prices and increase your earnings",
    },
    {
      icon: "⭐",
      title: "Build Reputation",
      description: "Get rated by customers and build your profile",
    },
    {
      icon: "🕒",
      title: "Flexible Schedule",
      description: "Work when you want and manage your own time",
    },
  ];
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await api.get(`/coins`);
        console.log("Coins :", response.data.userCoins);
        setUserCoins(response.data.userCoins);
      } catch (err: any) {
        console.log("Error :", err.response?.data?.message || err.message);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCoinsBalance();
    fetchProviderStats();
  }, [isAuthReady, token]);

  const fetchCoinsBalance = async () => {
    try {
      const res = await api.get("/coins");
      setUserCoins(res.data.userCoins || 0);
      setIsLoading(false);
    } catch (err: any) {
      console.log("Error :", err.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  const fetchProviderStats = async () => {
    // Mock data for now - replace with actual API calls
    setActiveRequests(12);
    setCompletedJobs(45);
    setEarnings(12500);
  };

  const handleViewDetails = (requestId: number) => {
    // Navigate to provider dashboard with the specific request
    window.location.href = `/provider-dashboard?request=${requestId}`;
  };

  const handleBuyCoins = () => {
    window.location.href = "/coins";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section - Provider Focused with Blue Theme */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 40%)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 text-blue-100 text-sm font-medium mb-6">
              🚀 Welcome Back to Your Business Dashboard
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Grow Your Service Business
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access new service requests, manage your jobs, and grow your
              earnings
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => (window.location.href = "/providerDashBoard")}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                <span>📋</span>
                View All Requests
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/providerProfile/${userID}`)
                }
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <span>👤</span>
                My Profile
              </button>
              <button
                onClick={handleBuyCoins}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <span>🪙</span>
                Buy Coins
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {activeRequests}
                </div>
                <div className="text-blue-200 text-sm">Active Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {completedJobs}
                </div>
                <div className="text-blue-200 text-sm">Completed Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">₹{earnings}</div>
                <div className="text-blue-200 text-sm">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providerStats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-lg border ${stat.borderColor} hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Service Requests */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              New Service Requests
            </h2>
            <p className="text-gray-600">
              Latest service requests in your area
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/provider-dashboard")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {serviceRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <div className="p-6">
                {/* Request Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {request.customerName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-sm">📍</span>
                      <span className="text-gray-600 text-sm">
                        {request.location}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      request.urgency === "High"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : request.urgency === "Medium"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    {request.urgency}
                  </span>
                </div>

                {/* Service Details */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-500">🔧</span>
                    <span className="font-semibold text-gray-900">
                      {request.service}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {request.description}
                  </p>
                </div>

                {/* Price and Time */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Offered Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      {request.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Posted</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {request.postedTime}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetails(request.id)}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>👁️</span>
                    View Details (50 Coins)
                  </button>
                  <button
                    onClick={handleBuyCoins}
                    className="px-4 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm"
                  >
                    Buy Coins
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Benefits */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-gray-600">
              Benefits of being a verified service provider on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {providerFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-xl p-6 text-center hover:bg-blue-100 transition-all duration-300 border border-blue-200"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get More Work?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start connecting with customers and grow your business today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/providerDashBoard")}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse All Requests
            </button>
            <button
              onClick={handleBuyCoins}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              🪙 Buy Coins Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProviderHomePage;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const CommonHome = () => {
  const token = useSelector((state: any) => state.auth.jwtToken);
  const accessToken = localStorage.getItem("accessToken");
  const [userCoins, setUserCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(""); // 'customer' or 'provider'

  // Mock data for service categories
  const serviceCategories = [
    {
      id: 1,
      name: "Plumbing",
      icon: "🚰",
      description: "Fixing leaks, installations, and repairs",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Electrical",
      icon: "⚡",
      description: "Wiring, repairs, and installations",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: 3,
      name: "Cleaning",
      icon: "🧹",
      description: "Home and office cleaning services",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Carpentry",
      icon: "🪚",
      description: "Furniture repair and woodwork",
      gradient: "from-amber-600 to-orange-600",
    },
  ];

  // Features section
  const features = [
    {
      icon: "✅",
      title: "Verified Professionals",
      description: "All service providers are background verified and skilled",
    },
    {
      icon: "💰",
      title: "Best Price Guarantee",
      description: "Get competitive prices with no hidden charges",
    },
    {
      icon: "🛡️",
      title: "Service Guarantee",
      description: "30-day service warranty on all repairs",
    },
    {
      icon: "⚡",
      title: "Quick Response",
      description: "Get connected with providers within minutes",
    },
  ];

  // Quick actions based on user type
  const quickActions = [
    {
      id: 1,
      title: "Post Service Request",
      description: "Describe what you need and get quotes",
      icon: "📝",
      url: "/post-request",
      color: "bg-blue-600 hover:bg-blue-700",
      visible: ["customer", ""],
    },
    {
      id: 2,
      title: "Browse Services",
      description: "Find service providers near you",
      icon: "🔍",
      url: "/services",
      color: "bg-green-600 hover:bg-green-700",
      visible: ["customer", ""],
    },
    {
      id: 3,
      title: "View Requests",
      description: "Check new service requests",
      icon: "📋",
      url: "/provider-dashboard",
      color: "bg-purple-600 hover:bg-purple-700",
      visible: ["provider"],
    },
    {
      id: 4,
      title: "My Profile",
      description: "Update your profile and services",
      icon: "👤",
      url: "/profile",
      color: "bg-indigo-600 hover:bg-indigo-700",
      visible: ["customer", "provider"],
    },
    {
      id: 5,
      title: "Buy Coins",
      description: "Get coins to contact customers",
      icon: "🪙",
      url: "/buy-coins",
      color: "bg-yellow-600 hover:bg-yellow-700",
      visible: ["provider"],
    },
    {
      id: 6,
      title: "My Bookings",
      description: "View your service bookings",
      icon: "📅",
      url: "/bookings",
      color: "bg-orange-600 hover:bg-orange-700",
      visible: ["customer"],
    },
  ];

  useEffect(() => {
    // Check if user is logged in and fetch data
    if (accessToken) {
      fetchUserData();
      // For demo, set user type - in real app, get from API
      setUserType("customer"); // Change to "provider" for provider view
    } else {
      setIsLoading(false);
    }
  }, [accessToken]);

  const fetchUserData = async () => {
    try {
      // Fetch coins balance for providers
      if (userType === "provider") {
        const COINS_URL = import.meta.env.VITE_COINS_URL;
        const response = await fetch(COINS_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || accessToken}`,
          },
        });
        const data = await response.json();
        setUserCoins(data.userCoins || 0);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    if (!accessToken) {
      return "Quality Home Services At Your Doorstep";
    }
    return userType === "provider"
      ? "Welcome Back to Your Business Dashboard"
      : "Welcome Back to HomeServe";
  };

  const getSubtitle = () => {
    if (!accessToken) {
      return "Connect with trusted professionals for all your home maintenance and repair needs";
    }
    return userType === "provider"
      ? "Access new service requests, manage your jobs, and grow your earnings"
      : "Find trusted professionals for all your home service needs";
  };

  const getFilteredQuickActions = () => {
    return quickActions.filter(
      (action) =>
        action.visible.includes(userType) ||
        (!accessToken && action.visible.includes(""))
    );
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

      {/* Hero Section - Dynamic based on login status */}
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
            {accessToken && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 text-blue-100 text-sm font-medium mb-6">
                {userType === "provider"
                  ? "🚀 Grow Your Business"
                  : "👋 Welcome Back"}
                {userType === "provider" && userCoins > 0 && (
                  <span className="ml-2">• {userCoins} Coins Available</span>
                )}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {getWelcomeMessage()}
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              {getSubtitle()}
            </p>

            {/* Dynamic CTA Buttons based on login status */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!accessToken ? (
                <>
                  <button
                    onClick={() => (window.location.href = "/signup")}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
                  >
                    Become a Customer
                  </button>
                  <button
                    onClick={() => (window.location.href = "/signup")}
                    className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Become a Provider
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  {getFilteredQuickActions().map((action) => (
                    <button
                      key={action.id}
                      onClick={() => (window.location.href = action.url)}
                      className={`px-5 py-3 text-white rounded-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 ${action.color}`}
                    >
                      <span>{action.icon}</span>
                      <span>{action.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stats for logged-in users */}
            {accessToken && (
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userType === "provider" ? "12" : "3"}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {userType === "provider"
                      ? "Active Requests"
                      : "Active Bookings"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userType === "provider" ? "45" : "12"}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {userType === "provider"
                      ? "Completed Jobs"
                      : "Services Used"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userType === "provider" ? "4.8" : "4.9"}
                  </div>
                  <div className="text-blue-200 text-sm">Average Rating</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 text-gray-50 fill-current"
          >
            <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z"></path>
          </svg>
        </div>
      </div>

      {/* Quick Stats Section for logged-in users */}
      {accessToken && userType === "provider" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userCoins}
              </div>
              <div className="text-gray-600 text-sm">Available Coins</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200 text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-gray-600 text-sm">New Requests</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200 text-center">
              <div className="text-2xl font-bold text-purple-600">₹12,500</div>
              <div className="text-gray-600 text-sm">Total Earnings</div>
            </div>
          </div>
        </div>
      )}

      {/* Service Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {accessToken ? "Popular Services" : "Our Services"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {accessToken
              ? "Services you might be interested in"
              : "Professional home services delivered by verified experts"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div
                className={`h-2 bg-gradient-to-r ${category.gradient}`}
              ></div>
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {category.description}
                </p>
                <button
                  onClick={() =>
                    (window.location.href = accessToken
                      ? `/book-service/${category.name.toLowerCase()}`
                      : `/services/${category.name.toLowerCase()}`)
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                >
                  {accessToken ? "Book Now" : "Explore Services"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600">
              {accessToken
                ? "We're committed to your satisfaction"
                : "Experience the difference with our customer-first approach"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-xl p-6 text-center hover:bg-blue-100 transition-all duration-300 border border-blue-200"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
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

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            {accessToken
              ? "Need Help With Something Else?"
              : "Ready to Get Started?"}
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            {accessToken
              ? "We're here to help with all your home service needs"
              : "Join thousands of satisfied customers and professional service providers"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/signup")}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {accessToken ? "Post New Request" : "Sign Up as Customer"}
            </button>
            {!accessToken && (
              <button
                onClick={() => (window.location.href = "/signup")}
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Become a Provider
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CommonHome;

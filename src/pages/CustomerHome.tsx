import { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const CustomerHomePage = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Service categories for customers
  const serviceCategories = [
    {
      id: "all",
      name: "All Services",
      icon: "🏠",
    },
    {
      id: "plumbing",
      name: "Plumbing",
      icon: "🚰",
    },
    {
      id: "electrical",
      name: "Electrical",
      icon: "⚡",
    },
    {
      id: "cleaning",
      name: "Cleaning",
      icon: "🧹",
    },
    {
      id: "carpentry",
      name: "Carpentry",
      icon: "🪚",
    },
    {
      id: "ac",
      name: "AC Repair",
      icon: "❄️",
    },
  ];

  // Popular services with real provider data
  const popularServices = [
    {
      id: 1,
      name: "Emergency Plumbing",
      category: "plumbing",
      provider: "Vishal Plumbing Services",
      rating: 4.8,
      reviews: 124,
      price: "₹500",
      time: "Within 2 hours",
    },
    {
      id: 2,
      name: "Electrical Wiring",
      category: "electrical",
      provider: "Safe Electricians",
      rating: 4.7,
      reviews: 98,
      price: "₹800",
      time: "Same day",
    },
    {
      id: 3,
      name: "Deep Home Cleaning",
      category: "cleaning",
      provider: "Sparkle Clean",
      rating: 4.9,
      reviews: 156,
      price: "₹1200",
      time: "Flexible slots",
    },
    {
      id: 4,
      name: "Furniture Repair",
      category: "carpentry",
      provider: "Wood Craftsmen",
      rating: 4.6,
      reviews: 87,
      price: "₹600",
      time: "Next day",
    },
  ];

  useEffect(() => {
    if (!isAuthReady) return;

    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(false);
  }, [token, isAuthReady]);

  // Filter services based on active category
  const filteredServices =
    activeCategory === "all"
      ? popularServices
      : popularServices.filter(
          (service) => service.category === activeCategory
        );

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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome Back
            </h1>
            <p className="text-blue-100 mb-8 text-lg">
              Find trusted professionals for your home needs
            </p>

            {/* Quick Action Button */}
            <button
              onClick={() => (window.location.href = "/postRequirement")}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Post Service Request
            </button>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Service
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {service.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {service.price}
                    </div>
                    <div className="text-gray-500 text-xs">starting from</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  by {service.provider}
                </p>

                <div className="flex items-center gap-1 mb-3">
                  <span className="text-yellow-500 text-sm">★★★★★</span>
                  <span className="text-gray-600 text-xs">
                    {service.rating} ({service.reviews})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <span>⏱️</span>
                  <span>{service.time}</span>
                </div>

                <button
                  onClick={() =>
                    (window.location.href = `/book-service/${service.id}`)
                  }
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Post Request</h3>
              <p className="text-gray-600 text-sm">
                Describe what service you need
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Get Quotes</h3>
              <p className="text-gray-600 text-sm">
                Receive quotes from professionals
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">✅</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Book Service</h3>
              <p className="text-gray-600 text-sm">
                Choose and book your preferred expert
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <button
            onClick={() => (window.location.href = "/postRequirement")}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Post New Request
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerHomePage;

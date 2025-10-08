import { useState } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for service categories
  const serviceCategories = [
    {
      id: 1,
      name: "Plumbing",
      icon: "🚰",
      description: "Fixing leaks, installations, and repairs",
    },
    {
      id: 2,
      name: "Electrical",
      icon: "⚡",
      description: "Wiring, repairs, and installations",
    },
    {
      id: 3,
      name: "Cleaning",
      icon: "🧹",
      description: "Home and office cleaning services",
    },
    {
      id: 4,
      name: "Carpentry",
      icon: "🪚",
      description: "Furniture repair and woodwork",
    },
    {
      id: 5,
      name: "Painting",
      icon: "🎨",
      description: "Wall painting and decoration",
    },
    {
      id: 6,
      name: "AC Repair",
      icon: "❄️",
      description: "AC servicing and maintenance",
    },
  ];

  // Mock data for popular services
  const popularServices = [
    {
      id: 1,
      name: "Emergency Plumbing",
      provider: "Vishal Plumbing Services",
      rating: 4.8,
      reviews: 124,
      price: "₹500 onwards",
    },
    {
      id: 2,
      name: "Electrical Wiring",
      provider: "Safe Electricians",
      rating: 4.7,
      reviews: 98,
      price: "₹800 onwards",
    },
    {
      id: 3,
      name: "Deep Cleaning",
      provider: "Sparkle Clean",
      rating: 4.9,
      reviews: 156,
      price: "₹1200 onwards",
    },
    {
      id: 4,
      name: "Furniture Repair",
      provider: "Wood Craftsmen",
      rating: 4.6,
      reviews: 87,
      price: "₹600 onwards",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Trusted Service Providers
            </h1>
            <p className="text-xl mb-8">
              Connect with skilled professionals for all your home service needs
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for services (e.g., Plumbing, Electrical, Cleaning...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Service Categories
          </h2>
          <p className="text-gray-600">
            Choose from a wide range of professional services
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600">{category.description}</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                View Services →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-gray-600">
              Most booked services by our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    by {service.provider}
                  </p>
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-gray-600 text-sm ml-2">
                      {service.rating} ({service.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {service.price}
                  </p>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600">
            Get your services done in 3 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Choose a Service
            </h3>
            <p className="text-gray-600">
              Browse through categories and select the service you need
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Book a Provider
            </h3>
            <p className="text-gray-600">
              Compare providers and book the one that fits your needs
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get Service Done
            </h3>
            <p className="text-gray-600">
              Sit back and relax while professionals handle your needs
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

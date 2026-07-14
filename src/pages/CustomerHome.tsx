import { useEffect, useState } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  Truck,
  Check,
} from "lucide-react";
import api from "../api/axios";
import type { ServicePackage } from "../interfaces/ServicePackageInterface";

const CustomerHomePage = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);

  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!token) navigate("/login");
  }, [token, isAuthReady, navigate]);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/packages/all/packages", {
          params: {
            page: 1,
            limit: 6,
          },
        });
        setPackages(data.packages);
      } catch (error) {
        console.error("Failed to fetch featured packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPackages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            <button
              onClick={() => navigate("/postRequirement")}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Post Service Request
            </button>
          </div>
        </div>
      </div>

      {/* Featured Packages Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Popular Service Packages
          </h2>
          <p className="text-gray-600">
            Choose from our curated service packages
          </p>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* No packages state */}
        {!loading && packages.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No packages available right now.</p>
          </div>
        )}

        {/* Packages Grid */}
        {!loading && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-5">
                  {/* Title */}
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {pkg.packageTitle}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {pkg.packageDescription}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{pkg.packagePrice}
                    </p>
                    <p className="text-xs text-gray-500">one-time service</p>
                  </div>

                  {/* Services List - first 2 only on homepage */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Services Included:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.packageServicesList
                        .slice(0, 2)
                        .map((service, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-xs text-gray-600"
                          >
                            <Check className="w-3 h-3 text-green-500 mr-1" />
                            {service}
                          </span>
                        ))}
                      {pkg.packageServicesList.length > 2 && (
                        <span className="text-xs text-blue-500">
                          +{pkg.packageServicesList.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-600 text-xs">
                      <Clock className="w-3 h-3 mr-2 text-blue-500" />
                      <span>Service Time: {pkg.packageTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <Truck className="w-3 h-3 mr-2 text-blue-500" />
                      <span>Delivery: {pkg.packagesDeliveryTime}</span>
                    </div>
                  </div>

                  {/* Provider */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Provider</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {pkg.providerName}
                    </p>
                  </div>

                  {/* Book Now */}
                  <button
                    onClick={() => navigate(`/book-package/${pkg._id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/all-packages")}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2"
          >
            View All Packages
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
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
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Post Request</h3>
              <p className="text-gray-600 text-sm">
                Describe what service you need
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Get Quotes</h3>
              <p className="text-gray-600 text-sm">
                Receive quotes from professionals
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
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
          <h2 className="text-2xl font-bold mb-4">Need Something Custom?</h2>
          <p className="text-blue-100 mb-6">
            Post your specific requirement and get quotes from professionals
          </p>
          <button
            onClick={() => navigate("/postRequirement")}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Post New Request
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerHomePage;

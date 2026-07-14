import { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Clock,
  Truck,
  Search,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";

import type { ServicePackage } from "../interfaces/ServicePackageInterface";

const AllPackagesPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPackages, setTotalPackages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<string[]>(["all"]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!token) navigate("/login");
  }, [token, isAuthReady, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/packages/categories");
        setCategories(["all", ...data.categories]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/packages/all/packages", {
          params: {
            page: currentPage,
            limit: 6,
            search: searchTerm,
            category: selectedCategory,
          },
        });
        setPackages(data.packages);
        setTotalPages(data.totalPages);
        setTotalPackages(data.totalPackages);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [currentPage, searchTerm, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              All Service Packages
            </h1>
            <p className="text-blue-100 text-lg">
              Browse through our curated service packages from trusted providers
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages by name, provider, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{packages.length}</span> of{" "}
            <span className="font-semibold">{totalPackages}</span> packages
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && packages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No packages found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          !loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="p-5">
                      {/* Title & Category */}
                      <div className="mb-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                            {pkg.packageTitle}
                          </h3>
                          <div className="bg-blue-100 rounded-full px-2 py-1 ml-2">
                            <p className="text-xs font-medium text-blue-700 whitespace-nowrap">
                              {pkg.packageCategory}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {pkg.packageDescription}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{pkg.packagePrice}
                        </p>
                        <p className="text-xs text-gray-500">
                          one-time service
                        </p>
                      </div>

                      {/* Services List */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Services Included:
                        </p>
                        <div className="flex flex-col gap-1">
                          {pkg.packageServicesList
                            .slice(0, 3)
                            .map((service, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-xs text-gray-600"
                              >
                                <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                <span>{service}</span>
                              </div>
                            ))}
                          {pkg.packageServicesList.length > 3 && (
                            <p className="text-xs text-blue-500 mt-1">
                              +{pkg.packageServicesList.length - 3} more
                              services
                            </p>
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
                        onClick={() => navigate(`/book-package/${pkg._id}`)} // FIX: _id not id
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-colors ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="w-10 h-10 flex items-center justify-center text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      },
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllPackagesPage;

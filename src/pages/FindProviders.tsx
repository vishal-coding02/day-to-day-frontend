import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import type ProviderProfileData from "../interfaces/ProviderProfileInterface";

const FindProviders = () => {
  const navigate = useNavigate();
  // State for search and filters
  const token = useSelector((state: any) => state.auth.jwtToken);
  const accessToken = localStorage.getItem("accessToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [providers, setProviders] = useState<ProviderProfileData[]>([]);

  function handleSearchFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    let queryParams = new URLSearchParams();

    if (searchTerm.trim() !== "") {
      queryParams.append("name", searchTerm);
    }
    if (priceRange.trim() !== "all") {
      queryParams.append("priceRange", priceRange);
    }
    if (selectedService !== "all") {
      queryParams.append("serviceType", selectedService);
    }

    navigate(`?${queryParams.toString()}`, { replace: true });

    let url = `${BACKEND_URL}/customers/providers?${queryParams.toString()}`;
    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token || accessToken}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setProviders(data.data);
          console.log(data.data);
        } else {
          setProviders([]);
        }
      })
      .catch((err) => console.log("Error :", err.message));
  }, [searchTerm, priceRange, selectedService, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavBar />
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find the Perfect Service Provider
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with skilled professionals for all your service needs.
            Browse profiles, compare prices, and book with confidence.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Providers
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, or keyword"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  value={searchTerm}
                  onChange={handleSearchFilter}
                />
              </div>
            </div>

            {/* Service Filter */}
            <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Type
              </label>
              <select
                id="service"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="all">All Services</option>
                <option value="cleaning">Cleaning</option>
                <option value="plumbing">Plumbing</option>
                <option value="tutoring">Tutoring</option>
                <option value="repair">Repair</option>
                <option value="beauty">Beauty</option>
                <option value="gardening">Gardening</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price Range
              </label>
              <select
                id="price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">Any Price</option>
                <option value="inr_low">₹100 - ₹200/hour</option>
                <option value="inr_mid">₹200 - ₹500/hour</option>
                <option value="inr_high">₹500 - ₹1000/hour</option>
                <option value="inr_premium">₹1000 - ₹2000/hour</option>
                <option value="inr_vip">₹2000+/hour</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mt-4 flex flex-wrap items-center">
            <span className="text-sm font-medium text-gray-700 mr-3">
              Rating:
            </span>
            {["all", "4.5+", "4.0+", "3.5+"].map((rating) => (
              <button
                key={rating}
                className={`px-3 py-1 rounded-full text-sm mr-2 mb-2 ${
                  ratingFilter === rating
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-700"
                } hover:bg-blue-100 hover:text-blue-600 transition duration-200`}
                onClick={() => setRatingFilter(rating)}
              >
                {rating === "all" ? "Any Rating" : rating}
              </button>
            ))}
          </div>
        </div>

        {/* Providers List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Providers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-200"
              >
                <div className="relative p-6 flex justify-center">
                  {/* Circular Image Container */}
                  <div className="relative w-32 h-32">
                    <img
                      src={provider.providerImageUrl}
                      alt={provider.providerName}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 shadow flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">
                        {provider.providerAvgRating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-center w-full">
                      <h3 className="text-xl font-bold text-gray-800">
                        {provider.providerName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {provider.providerServicesList.join(" , ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center my-3">
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                      {provider.providerPricing?.pricePerHour ?? "N/A"} -
                      {provider.providerPricing?.workTime ?? "N/A"}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-center">
                    {provider.providerBio}
                  </p>
                  {/* 
                  <div className="flex items-center text-sm text-gray-500 mb-6 justify-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{provider} reviews</span>
                  </div> */}

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-center">
                      Book Now
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/providerProfile/${provider.userID}`)
                      }
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200 font-medium text-center"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FindProviders;

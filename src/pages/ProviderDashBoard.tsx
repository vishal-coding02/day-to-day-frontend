import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type Request from "../interfaces/ProviderDashBoard";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router";
import api from "../api/axios";

interface ContactedRequest {
  requestId: string;
  customerContact: string;
}

const ProviderDashBoard = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [userCoins, setUserCoins] = useState(0);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [contactedRequests, setContactedRequests] = useState<
    ContactedRequest[]
  >([]);

  useEffect(() => {
    const currentUserId = localStorage.getItem("userID");
    const savedContactedRequests = localStorage.getItem(
      `contactedRequests_${currentUserId}`
    );
    if (savedContactedRequests) {
      setContactedRequests(JSON.parse(savedContactedRequests));
    }
  }, []);

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
  }, [token]);

  useEffect(() => {
    const fetchProviderDashboard = async () => {
      try {
        const response = await api.get("/providers/providerDashBoard");
        console.log("All Customers Requests", response.data);
        if (response.data.requests && Array.isArray(response.data.requests)) {
          setRequests(response.data.requests);
        } else {
          setRequests([]);
        }
        setLoading(false);
      } catch (err: any) {
        console.log("Error :", err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProviderDashboard();
  }, [token]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleAcceptClick = (request: Request) => {
    setSelectedRequest(request);
    setShowContactModal(true);
  };
  const handleContactPurchase = async () => {
    if (!selectedRequest) return;
    try {
      const response = await api.post("/providers/customerContact", {
        deductCoins: 50,
        id: selectedRequest.userID,
      });
      if (response.data.success) {
        console.log("Contact Data", response.data);
        alert(response.data.message);
        setUserCoins(response.data.updatedCoins);
        const newContactedRequest = {
          requestId: selectedRequest._id,
          customerContact: response.data.customerContact,
        };
        setContactedRequests((prev) => {
          const updated = [...prev, newContactedRequest];
          const currentUserId = localStorage.getItem("userID");
          localStorage.setItem(
            `contactedRequests_${currentUserId}`,
            JSON.stringify(updated)
          );
          return updated;
        });
        setShowContactModal(false);
      } else {
        alert(response.data.message);
        if (
          response.data.message.includes("insufficient") ||
          response.data.message.includes("not enough")
        ) {
          navigate("/coins");
        }
      }
    } catch (error: any) {
      console.error(
        "Error purchasing contact:",
        error.response?.data?.message || error.message
      );
      alert("Error purchasing contact. Please try again.");
    }
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedRequest(null);
  };

  const getContactedRequest = (requestId: string) => {
    return contactedRequests.find((req) => req.requestId === requestId);
  };

  const hasSufficientCoins = userCoins >= 50;
  const coinsNeeded = 50 - userCoins;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Service Requests</h1>
            <p className="text-blue-100">
              Discover service requests that match your expertise
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="bg-white text-blue-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {requests.length} Active Requests
              </div>
              <div className="bg-white text-blue-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                Available Coins: {userCoins}
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="max-w-7xl mx-auto">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No requests found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You don't have any service requests yet. New requests will
                appear here when customers need your services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {requests.map((request) => {
                const contactedRequest = getContactedRequest(request._id);
                const isContacted = !!contactedRequest;

                return (
                  <div
                    key={request._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Customer Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {request.customerName?.charAt(0) || "C"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate">
                            {request.customerName}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <p className="text-sm text-gray-600 truncate">
                              {request.customerLocation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="p-6">
                      {/* Services Needed */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Services Needed
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {request.customerServicesList.map(
                            (service, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                              >
                                {service}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Description
                          </h4>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-200">
                          {request.customerDescription}
                        </p>
                      </div>

                      {/* Price and Date */}
                      <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Offered Price
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{request.customerPrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Posted
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Reference Photo */}
                      {request.customerMedia && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                              Reference Photo
                            </h4>
                          </div>
                          <div className="relative group">
                            <img
                              src={request.customerMedia}
                              alt="Service reference"
                              className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = "none";
                                const placeholder =
                                  document.createElement("div");
                                placeholder.className =
                                  "w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center";
                                placeholder.innerHTML = `
                                  <div class="text-center text-gray-500">
                                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p class="text-sm">Image not available</p>
                                  </div>
                                `;
                                img.parentNode?.appendChild(placeholder);
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v0"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                      {isContacted ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg p-3 border border-green-200">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="font-semibold">Contacted!</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Customer Number:{" "}
                            <span className="font-mono font-bold text-blue-600">
                              +91 {contactedRequest.customerContact}
                            </span>
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                contactedRequest.customerContact
                              );
                              alert("Phone number copied to clipboard!");
                            }}
                            className="mt-2 px-4 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Copy Number
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAcceptClick(request)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Accept Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Contact Purchase Modal */}
      {showContactModal && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
            onClick={closeContactModal}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10 transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Get Customer Contact
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Contact details for {selectedRequest.customerName}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Contact Price
                    </p>
                    <p className="text-2xl font-bold text-gray-900">50 Coins</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      Your Balance
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        hasSufficientCoins ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {userCoins} Coins
                    </p>
                  </div>
                </div>
              </div>

              {!hasSufficientCoins && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Insufficient Balance
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        You need {coinsNeeded} more coins to purchase this
                        contact
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleContactPurchase}
                  disabled={!hasSufficientCoins}
                  className={`w-full px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                    hasSufficientCoins
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {hasSufficientCoins
                    ? "Buy Contact - 50 Coins"
                    : "Insufficient Coins"}
                </button>

                <button
                  onClick={() => navigate("/coins")}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Add More Coins
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
              <button
                onClick={closeContactModal}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProviderDashBoard;

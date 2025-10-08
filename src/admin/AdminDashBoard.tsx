import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const ADMIN_DASHBIARD_URL = import.meta.env.VITE_ADMIN_DASHBOARD_URL;
const ADMIN_DASHBOARD_AllUSERS_URL = import.meta.env
  .VITE_ADMIN_DASHBOARD_AllUSERS_URL;
const APPROVED_MAIL_URL = import.meta.env.VITE_APPROVED_MAIL_URL;
const REJECT_PROVIDER_URL = import.meta.env.VITE_REJECT_PROVIDER_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("users");
  const accessToken = localStorage.getItem("accessToken");
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [pendingProvidersData, setPendingProvidersData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const handleApprove = async (provider: any) => {
    try {
      let currentToken = token || accessToken;

      const res = await fetch(APPROVED_MAIL_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          providerId: provider._id,
          userId: provider.userID,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Provider Approved:", data);
        alert(`Approval email sent successfully!`);
        fetchPendingProviders();
      } else {
        console.error("Approval failed:", data);
        alert(`Approval failed: ${data.message || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error approving provider:", err.message);
      alert("Error approving provider");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      let currentToken = token || accessToken;

      const res = await fetch(REJECT_PROVIDER_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          providerId: selectedProvider._id,
          userId: selectedProvider.userID,
          reason: rejectReason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Provider Rejected:", data);
        alert(`Provider rejected successfully!`);
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedProvider(null);

        fetchPendingProviders();
      } else {
        console.error("Rejection failed:", data);
        alert(`Rejection failed: ${data.message || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error rejecting provider:", err.message);
      alert("Error rejecting provider");
    }
  };

  const openRejectModal = (provider: any) => {
    setSelectedProvider(provider);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedProvider(null);
    setRejectReason("");
  };

  const fetchPendingProviders = () => {
    let currentToken = token;
    fetch(ADMIN_DASHBIARD_URL, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${currentToken || accessToken}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("All Pending Providers", data);

        if (Array.isArray(data.allProviders)) {
          setPendingProvidersData(data.allProviders);
        } else {
          setPendingProvidersData([]);
        }
      })
      .catch((err) => {
        console.log("Error :", err.message);
      });
  };

  useEffect(() => {
    fetchPendingProviders();
  }, [token]);

  useEffect(() => {
    let currentToken = token;
    fetch(ADMIN_DASHBOARD_AllUSERS_URL, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${currentToken || accessToken}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("All Users", data);

        if (Array.isArray(data.allUsers)) {
          setUsersData(data.allUsers);
        } else {
          setUsersData([]);
        }
      })
      .catch((err) => {
        console.log("Error :", err.message);
      });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${
          showRejectModal ? "blur-sm" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-blue-100 bg-blue-700 bg-opacity-25 px-3 py-1 rounded-full text-sm">
                  {usersData.length} Users
                </span>
                <span className="text-blue-100 bg-blue-700 bg-opacity-25 px-3 py-1 rounded-full text-sm">
                  {
                    pendingProvidersData.filter((p) => p.status === "pending")
                      .length
                  }{" "}
                  Pending Providers
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
          {/* Tabs */}
          <div className="bg-white rounded-t-lg shadow-sm">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm rounded-tl-lg ${
                  activeTab === "users"
                    ? "bg-white text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-700 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                  <span>All Users ({usersData.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("providers")}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm rounded-tr-lg ${
                  activeTab === "providers"
                    ? "bg-white text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-700 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>
                    Pending Providers (
                    {
                      pendingProvidersData.filter((p) => p.status === "pending")
                        .length
                    }
                    )
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg shadow-lg p-6">
            {/* All Users Tab */}
            {activeTab === "users" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {usersData.length > 0 ? (
                  usersData.map((user, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6">
                        {/* User Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {user.userName?.charAt(0) || "U"}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {user.userName || "Unknown User"}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.userType === "provider"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {user.userType || "customer"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{user.userPhone || "N/A"}</span>
                          </div>

                          {user.userAddress && (
                            <div className="flex items-start text-sm text-gray-600">
                              <svg
                                className="w-4 h-4 mr-2 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 012.827 0l4.244-4.243a8 8 0 10-11.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>
                                {user.userAddress.street &&
                                  `${user.userAddress.street}, `}
                                {user.userAddress.city &&
                                  `${user.userAddress.city}, `}
                                {user.userAddress.state &&
                                  `${user.userAddress.state}, `}
                                {user.userAddress.country &&
                                  `${user.userAddress.country}`}
                                {user.userAddress.zipCode &&
                                  ` - ${user.userAddress.zipCode}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer buttons */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <div className="flex space-x-3">
                          <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            View Profile
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No users found
                    </h3>
                    <p className="mt-1 text-gray-500">
                      There are no users registered in the system yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Providers Tab */}
            {activeTab === "providers" && (
              <div className="grid gap-6 md:grid-cols-2">
                {pendingProvidersData.filter((p) => p.status === "pending")
                  .length > 0 ? (
                  pendingProvidersData
                    .filter((p) => p.status === "pending")
                    .map((provider, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                  {provider.providerName?.charAt(0) || "P"}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {provider.providerName}
                                </h3>
                                <div className="flex items-center mt-1">
                                  <svg
                                    className="w-5 h-5 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="ml-1 text-sm text-gray-600">
                                    {provider.providerAvgRating || "0.0"} (0
                                    reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              About
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {provider.providerBio || "No bio provided."}
                            </p>
                          </div>

                          {provider.providerServicesList &&
                            provider.providerServicesList.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Services
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {provider.providerServicesList.map(
                                    (service: string, i: number) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                      >
                                        {service}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApprove(provider)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(provider)}
                              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                navigate(
                                  `/reviewProviderProfile/${provider.userID}`
                                );
                              }}
                              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No pending providers
                    </h3>
                    <p className="mt-1 text-gray-500">
                      There are no provider applications pending review.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/10"
            onClick={closeRejectModal}
          ></div>

          {/* Modal Box */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative z-10">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reject Provider Application
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting{" "}
                {selectedProvider?.providerName}'s application.
              </p>

              <div className="mb-4">
                <label
                  htmlFor="rejectReason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for Rejection
                </label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter the reason for rejection..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm rounded-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import type CustomerProfile from "../interfaces/CustomerInterface";
import api from "../api/axios";
import { useLogout } from "../components/LogoutButton";

const CustomerProfilePage = () => {
  const logout = useLogout()
  const [customerData, setCustomerData] = useState<CustomerProfile | null>(
    null
  );
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [activeTab, setActiveTab] = useState("profile");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/customers/profile/${id}`);

        const data = await res.data;
        console.log("customer profile response:", data);

        setCustomerData(data.data);
      } catch (err: any) {
        console.log("Error :", err.response?.data?.message || err.message);
      }
    };

    fetchData();
  }, [id, token]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Customer Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Information
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "contacts"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("contacts")}
            >
              Purchased Contacts (
              {customerData?.providerContactList?.length || 0})
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "settings"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                    <i className="fas fa-user text-blue-400 text-5xl"></i>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-100 rounded-full p-2">
                    <i className="fas fa-check-circle text-blue-600 text-xl"></i>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {customerData?.userName || "Customer Name"}
                  </h2>
                  <p className="text-gray-600 mt-1">Registered Customer</p>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-user mr-2 text-blue-600"></i>
                      <span>Customer Account</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                      <span>
                        Member since{" "}
                        {customerData?.createdAt
                          ? new Date(
                              customerData?.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-address-card mr-2 text-blue-600"></i>
                    Contact Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <i className="fas fa-user text-gray-500 w-6"></i>
                      <span className="text-gray-700">
                        {customerData?.userName}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <i className="fas fa-phone text-gray-500 w-6"></i>
                      <span className="text-gray-700">
                        {customerData?.userPhone}
                      </span>
                    </div>

                    {customerData?.userAddress && (
                      <div className="flex items-start">
                        <i className="fas fa-map-marker-alt text-gray-500 w-6 mt-1"></i>
                        <div>
                          <p className="text-gray-700">
                            {customerData.userAddress.street}
                          </p>
                          <p className="text-gray-700">
                            {customerData.userAddress.city},{" "}
                            {customerData.userAddress.state}{" "}
                            {customerData.userAddress.zipCode}
                          </p>
                          <p className="text-gray-700">
                            {customerData.userAddress.country}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                    Account Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <i className="fas fa-user-tag text-gray-500 w-6"></i>
                      <span className="text-gray-700">
                        Account Type: {customerData?.userType}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <i className="fas fa-calendar text-gray-500 w-6"></i>
                      <span className="text-gray-700">
                        Joined:{" "}
                        {customerData?.createdAt
                          ? new Date(
                              customerData?.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab Content */}
          {activeTab === "contacts" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Purchased Contacts
              </h2>

              {!customerData?.providerContactList ||
              customerData.providerContactList.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <i className="fas fa-address-book text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No purchased contacts yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You haven't purchased any provider contacts yet
                  </p>
                  <button
                    onClick={() => navigate("/providers")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Browse Service Providers
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {customerData.providerContactList.map((provider, index) => (
                    <div
                      key={provider._id || index}
                      className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <i className="fas fa-user-tie text-blue-400"></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {provider.userName}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {provider.userPhone}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center">
                            <i className="fas fa-phone mr-1"></i> Call
                          </button>
                          <button className="text-green-600 hover:text-green-800 flex items-center ml-3">
                            <i className="fas fa-comment mr-1"></i> Message
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab Content */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Account Settings
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Edit Profile Information
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Update your personal details and contact information
                    </p>
                  </div>
                  <button className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                    <i className="fas fa-edit mr-2"></i> Edit Profile
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Log Out</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sign out from your account
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="mt-3 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerProfilePage;

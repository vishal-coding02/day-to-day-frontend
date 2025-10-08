import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type ProviderInfoResponse from "../interfaces/AdminDashBord";

const ADMIN_DASHBOARD_REVIEW_PROVIDER_URL = import.meta.env
  .VITE_ADMIN_DASHBOARD_REVIEW_PROVIDER_URL;

const ReviewProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [providerInfo, setProviderInfo] = useState<ProviderInfoResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentToken = token;
    fetch(`${ADMIN_DASHBOARD_REVIEW_PROVIDER_URL}/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${currentToken || accessToken}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Provider Data", data);
        setProviderInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error :", err.message);
        setLoading(false);
      });
  }, [token, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading provider data...</p>
        </div>
      </div>
    );
  }

  if (!providerInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Provider not found
          </h3>
          <button
            onClick={() => navigate("/adminDashBoard")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { userData, providerData } = providerInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/adminDashBoard")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Admin Dashboard
          </button>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              providerData.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            Status: {providerData.status}
          </span>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <img
                src={providerData.providerImageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {providerData.providerName}
                </h1>
                <p className="text-blue-100">Service Provider Application</p>
                <div className="flex items-center mt-1">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.极速加速器-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm">
                    {providerData.providerAvgRating} •{" "}
                    {providerData.providerTotalJobs} jobs
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - User Information */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="text-gray-900">{userData.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <p className="text-gray-900">{userData.userPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        User Type
                      </label>
                      <p className="text-gray-900 capitalize">
                        {userData.userType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Member Since
                      </label>
                      <p className="text-gray-900">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Address Information
                  </h2>
                  <div className="space-y-3">
                    {userData.userAddress && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Address Type
                          </label>
                          <p className="text-gray-900 capitalize">
                            {userData.userAddress.addressType}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Street
                          </label>
                          <p className="text-gray-900">
                            {userData.userAddress.street}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              City
                            </label>
                            <p className="text-gray-900">
                              {userData.userAddress.city}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              State
                            </label>
                            <p className="text-gray-900">
                              {userData.userAddress.state}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              ZIP Code
                            </label>
                            <p className="text-gray-900">
                              {userData.userAddress.zipCode}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Country
                            </label>
                            <p className="text-gray-900">
                              {userData.userAddress.country}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Professional Information */}
              <div className="space-y-6">
                {/* Professional Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Professional Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Professional Bio
                      </label>
                      <p className="text-gray-900 mt-1 leading-relaxed">
                        {providerData.providerBio}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Services Offered
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {providerData.providerServicesList.map(
                          (service, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {service}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional ID */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Professional ID
                  </h2>
                  <div className="flex justify-center">
                    <img
                      src={providerData.providerIdProf}
                      alt="Professional ID"
                      className="max-w-full h-64 object-contain border rounded-lg"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Approve
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Reject
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProviderProfile;

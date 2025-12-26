import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { useLogout } from "./LogoutButton";

const RejectedProvider = () => {
  const logout = useLogout()
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [rejectedData, setRejectedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const id = localStorage.getItem("userID");

  useEffect(() => {
    const fetchRejectedProvider = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/rejected/${id}`);

        console.log("rejected provider data", res.data.rejectedData);
        setRejectedData(res.data.rejectedData);
      } catch (err: any) {
        console.log("Error :", err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRejectedProvider();
    }
  }, [id, token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rejection details...</p>
        </div>
      </div>
    );
  }

  if (!rejectedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Rejection Data Found
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any rejection information for your account.
          </p>
          <button
            onClick={logout}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Application Status
              </h1>
              <p className="text-blue-100">Provider Account Review</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-6 py-2 bg-amber-50 bg-opacity-20 text-blue-600 rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm cursor-pointer"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status Header */}
          <div className="bg-gradient-to-r  from-blue-500 to-indigo-600 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-50 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Application Rejected
            </h2>
            <p className="text-red-100">
              Your provider application has been reviewed and rejected
            </p>
          </div>

          {/* Rejection Details */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Rejection Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rejection Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-1">
                        Rejection Date
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(rejectedData.rejectedAt)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-1">
                        Application ID
                      </label>
                      <div className="flex items-center space-x-2 text-gray-900">
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
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                        <span className="font-mono text-sm">
                          {rejectedData._id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason for Rejection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Reason for Rejection
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
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
                    <p className="text-blue-800 leading-relaxed">
                      {rejectedData.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedProvider;

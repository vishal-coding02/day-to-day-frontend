import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import type ProviderProfileData from "../interfaces/ProviderProfileInterface";
import type { ServicePackage } from "../interfaces/ServicePackageInterface";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProviderProfile = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [userCoins, setUserCoins] = useState(0);
  const { id } = useParams();
  const [providerData, setProviderData] = useState<ProviderProfileData | null>(
    null
  );
  const [unlocked, setUnlocked] = useState(false);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [activeTab, setActiveTab] = useState<
    "profile" | "packages" | "settings" | "contact"
  >("profile");
  const [contactVisible, setContactVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const token = useSelector((state: any) => state.auth.jwtToken);

  useEffect(() => {
    if (!accessToken) return;

    fetch(`${BACKEND_URL}/coins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Coins :", data.userCoins);
        setUserCoins(data.userCoins);
      })
      .catch((err) => {
        console.log("Error :", err.message);
      });
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      let currentToken = token;
      try {
        const res = await fetch(`${BACKEND_URL}/providers/profile/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken || accessToken}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Provider Profile:", data);
        setProviderData(data.providerData);
      } catch (err: any) {
        console.log("Profile fetch error:", err.message);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchPackages = async () => {
      let currentToken = token;
      try {
        const res = await fetch(`${BACKEND_URL}/packages/providerPackages/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken || accessToken}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Provider Packages:", data);
        setPackages(data.myPackages || []);
      } catch (err: any) {
        console.log("Packages fetch error:", err.message);
      }
    };

    fetchPackages();
  }, [token, id]);

  useEffect(() => {
    const checkUnlocked = async () => {
      const res = await fetch(`${BACKEND_URL}/hasUnlocked/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || accessToken}`,
        },
      });
      const data = await res.json();
      setUnlocked(data.unlocked);
    };
    checkUnlocked();
  }, [id]);

  // Function to handle contact purchase
  const handlePurchaseContact = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/coins`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || accessToken}`,
        },
        body: JSON.stringify({
          deduct: 200,
          id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user coins
        setUserCoins(data.updatedCoins);
        // Show provider contact info
        setContactVisible(true);
      } else {
        alert(data.message || "Purchase failed");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("An error occurred during purchase");
    }
  };

  // Function to render star ratings
  const renderRatingStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <i key={i} className="fas fa-star-half-alt text-yellow-500"></i>
        );
      } else {
        stars.push(<i key={i} className="far fa-star text-yellow-500"></i>);
      }
    }
    return stars;
  };

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userID");
    localStorage.removeItem("userType");
    localStorage.removeItem("providerStatus");
    localStorage.removeItem("contactedRequests");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Service Provider Profile
            </h1>
            {userType === "provider" && (
              <p className="text-gray-600 mt-2">
                Manage your professional information and account settings
              </p>
            )}
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
                activeTab === "packages"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("packages")}
            >
              Service Packages ({packages.length})
            </button>
            {/* {userType === "customer" && (
              <button
                className={`py-3 px-6 font-medium text-sm ${
                  activeTab === "contact"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("contact")}
              >
                Contact
              </button>
            )} */}
            {userType === "provider" && (
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
            )}
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="relative">
                  <img
                    src={
                      providerData?.providerImageUrl || "/default-avatar.png"
                    }
                    alt={providerData?.providerName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-100 rounded-full p-2">
                    <i className="fas fa-check-circle text-blue-600 text-xl"></i>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {providerData?.providerName}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {providerData?.providerBio}
                  </p>

                  <div className="flex items-center mt-4">
                    <div className="flex mr-4">
                      {renderRatingStars(providerData?.providerAvgRating)}
                    </div>
                    <span className="text-gray-600">
                      {providerData?.providerAvgRating || 0} out of 5
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-briefcase mr-2 text-blue-600"></i>
                      <span>
                        {providerData?.providerTotalJobs || 0} Jobs Completed
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                      <span>
                        Member since{" "}
                        {new Date(
                          providerData?.createdAt || ""
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    {unlocked ? (
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-phone mr-2 text-blue-600"></i>
                        <span>{providerData?.userID?.userPhone}</span>
                      </div>
                    ) : (
                      userType === "customer" && (
                        <div className="mt-6">
                          <button
                            onClick={() => setActiveTab("contact")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                          >
                            <i className="fas fa-phone-alt mr-2"></i> Contact
                            Provider
                          </button>
                        </div>
                      )
                    )}
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
                        {providerData?.userID?.userName}
                      </span>
                    </div>

                    {userType === "provider" && (
                      <div className="flex items-center">
                        <i className="fas fa-phone text-gray-500 w-6"></i>
                        <span className="text-gray-700">
                          {providerData?.userID?.userPhone}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start">
                      <i className="fas fa-map-marker-alt text-gray-500 w-6 mt-1"></i>
                      <div>
                        <p className="text-gray-700">
                          {providerData?.userID?.userAddress?.street}
                        </p>
                        <p className="text-gray-700">
                          {providerData?.userID?.userAddress?.city},{" "}
                          {providerData?.userID?.userAddress?.state}{" "}
                          {providerData?.userID?.userAddress?.zipCode}
                        </p>
                        <p className="text-gray-700">
                          {providerData?.userID?.userAddress?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services & ID Verification */}
                <div className="space-y-6">
                  {/* Services */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <i className="fas fa-tools mr-2 text-blue-600"></i>
                      Services Offered
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {providerData?.providerServicesList?.map(
                        (service: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {service}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* ID Verification */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    {userType === "provider" && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <i className="fas fa-id-card mr-2 text-blue-600"></i>
                          ID Verification
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">
                            Identity Document
                          </span>
                          {providerData?.providerIdProf ? (
                            <a
                              href={providerData?.providerIdProf}
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <i className="fas fa-eye mr-1"></i> View ID
                            </a>
                          ) : (
                            <span className="text-red-500">Not provided</span>
                          )}
                        </div>
                      </>
                    )}

                    <div className="mt-3 flex items-center">
                      <span className="text-gray-700 mr-2">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          providerData?.status === "approve"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {providerData?.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Packages Tab Content */}
          {activeTab === "packages" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Service Packages
                </h2>
                {userType === "provider" && (
                  <button
                    onClick={() => navigate("/packages")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i> Create New Package
                  </button>
                )}
              </div>

              {packages.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No packages yet
                  </h3>
                  {userType === "provider" && (
                    <>
                      <p className="text-gray-500 mb-4">
                        Create your first service package to get started
                      </p>
                      <button
                        onClick={() => navigate("/packages")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      >
                        Create Your First Package
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {pkg.packageTitle}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pkg.packageStatus
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {pkg.packageStatus ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4">
                          {pkg.packageDescription}
                        </p>

                        <div className="flex items-baseline mb-4">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{pkg.packagePrice}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center text-gray-600 mb-1">
                            <i className="fas fa-clock mr-2 text-blue-600"></i>
                            <span>{pkg.packageTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <i className="fas fa-truck mr-2 text-blue-600"></i>
                            <span>{pkg.packagesDeliveryTime}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Services Included:
                          </h4>
                          <ul className="space-y-1">
                            {pkg.packageServicesList.map(
                              (service: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-center text-gray-600"
                                >
                                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                  <span>{service}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {userType === "provider" && (
                          <div className="flex justify-between mt-6">
                            <button className="text-blue-600 hover:text-blue-800 flex items-center">
                              <i className="fas fa-edit mr-1"></i> Edit
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 flex items-center">
                              <i className="fas fa-toggle-on mr-1"></i>{" "}
                              {pkg.packageStatus ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contact Tab Content */}
          {activeTab === "contact" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Contact Provider
              </h2>

              {!contactVisible ? (
                <div className="text-center">
                  <div className="mb-6">
                    <i className="fas fa-phone-alt text-4xl text-blue-600 mb-4"></i>
                    <p className="text-gray-700 mb-2">
                      Get access to this provider's contact information
                    </p>
                    <p className="text-lg font-semibold mb-4">
                      Cost: <span className="text-blue-600">200 Coins</span>
                    </p>
                    <p className="text-gray-600 mb-4">
                      Your current balance: <b>{userCoins} Coins</b>
                    </p>
                  </div>

                  {userCoins >= 200 ? (
                    <button
                      onClick={handlePurchaseContact}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
                    >
                      Unlock Contact Information
                    </button>
                  ) : (
                    <div>
                      <p className="text-red-500 mb-4">
                        You don't have enough coins to unlock this contact
                        information.
                      </p>
                      <button
                        onClick={() => navigate("/coins")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium text-lg"
                      >
                        Buy More Coins
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                    <p className="text-gray-700 mb-2">
                      Contact information unlocked successfully!
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
                    <h3 className="text-lg font-semibold mb-4">
                      Provider Contact Details
                    </h3>

                    <div className="space-y-4 text-left">
                      <div className="flex items-center">
                        <i className="fas fa-phone text-blue-600 w-6"></i>
                        <span className="ml-3">
                          {providerData?.userID?.userPhone}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Remaining coins: <b>{userCoins}</b>
                      </p>
                    </div>
                  </div>
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
                      Update your personal and professional details
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
                    onClick={handleLogout}
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

export default ProviderProfile;

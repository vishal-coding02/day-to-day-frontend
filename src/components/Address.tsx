import { useState } from "react";
import type AddressForm from "../interfaces/AddressInterfaces";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import api from "../api/axios";

const AddressVerification = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const userId = useSelector((state: any) => state.auth.userData.userId);
  const userType =
    useSelector((state: any) => state.auth.userData.type) ||
    localStorage.getItem("userType");
  const [addressData, setAddressData] = useState<AddressForm>({
    addressType: "current",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  async function handleCheckAddress() {
    if (!userId) {
      console.error("User ID is undefined!");
      return;
    }

    try {
      const res = await api.post("/auth/address", {
        id: userId,
        address: addressData,
      });

      const data = res.data;

      setSuccessMsg(data.message);
      setErrorMsg(null);

      console.log("Response from backend:", data);

      if (userType === "provider") {
        navigate("/providerProfileCreation");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      console.log("Error :", err.response?.data?.message || err.message);
      setErrorMsg(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
      setSuccessMsg(null);
    }

    // Reset address form
    setAddressData({
      addressType: "current",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        {/* Form Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold text-center">
            Verify Your Address
          </h1>
          <p className="text-center opacity-90 mt-2">
            Please enter your complete address to check service availability
          </p>
        </div>

        {/* Address Form */}
        <div className="p-6">
          <form
            className="space-y-6"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleCheckAddress();
            }}
          >
            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <strong>Address Type</strong>
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    id="current"
                    name="addressType"
                    type="radio"
                    value="current"
                    checked={addressData.addressType === "current"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="current"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Current Address
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="permanent"
                    name="addressType"
                    type="radio"
                    value="permanent"
                    checked={addressData.addressType === "permanent"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="permanent"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Permanent Address
                  </label>
                </div>
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <strong>Street Address</strong>
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Enter your street address
              </p>
              <input
                name="street"
                type="text"
                value={addressData.street}
                onChange={handleInputChange}
                placeholder="Enter your street address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              />
            </div>

            {/* City and State in one line */}
            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>City</strong>
                </label>
                <p className="text-sm text-gray-500 mb-2">City name</p>
                <input
                  name="city"
                  type="text"
                  value={addressData.city}
                  onChange={handleInputChange}
                  placeholder="City name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>State</strong>
                </label>
                <p className="text-sm text-gray-500 mb-2">Select state</p>
                <select
                  name="state"
                  value={addressData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                >
                  <option value="">Select state</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="NY">New York</option>
                  <option value="IL">Illinois</option>
                </select>
              </div>
            </div>

            {/* ZIP Code and Country in one line */}
            <div className="grid grid-cols-2 gap-4">
              {/* ZIP Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>ZIP Code</strong>
                </label>
                <p className="text-sm text-gray-500 mb-2">ZIP code</p>
                <input
                  name="zipCode"
                  type="text"
                  value={addressData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>Country</strong>
                </label>
                <p className="text-sm text-gray-500 mb-2">Country</p>
                <select
                  name="country"
                  value={addressData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="IN">India</option>
                </select>
              </div>
            </div>

            {/* Verify Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium text-lg"
              >
                Verify Address
              </button>
            </div>
          </form>

          {/* Success Message */}
          {successMsg && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Address Verified Successfully!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">{successMsg}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Service Not Available
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressVerification;

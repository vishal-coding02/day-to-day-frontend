import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import type AddressForm from "../interfaces/AddressInterfaces";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const AddressVerification = () => {
  const navitage = useNavigate();
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
    cityId: 0,
    state: "",
    stateId: 0,
    zipCode: 0,
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

  function handleCheckAddress() {
    if (!userId) {
      console.error("User ID is undefined!");
      return;
    }

    fetch(`${BACKEND_URL}/users/address`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: userId, address: addressData }),
    })
      .then((res) =>
        res.json().then((data) => ({ status: res.status, body: data }))
      )
      .then(({ status, body }) => {
        if (status === 200) {
          setSuccessMsg(body.message);
          setErrorMsg(null);
        } else {
          setErrorMsg(body.message);
          setSuccessMsg(null);
        }
        console.log("Response from backend:", body);
        if (userType == "provider") {
          navitage("/providerProfileCreation");
        } else {
          navitage("/login");
        }
      })
      .catch((err) => {
        console.log("Error :", err.message);
        setErrorMsg("Something went wrong. Please try again.");
        setSuccessMsg(null);
      });

    // Reset address form
    setAddressData({
      addressType: "current",
      street: "",
      city: "",
      cityId: 0,
      state: "",
      stateId: 0,
      zipCode: 0,
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
            className="space-y-4"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
            }}
          >
            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Address Type
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
                    className="ml-2 block text-sm font-medium text-gray-700"
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
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Permanent Address
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address
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
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={addressData.street}
                  onChange={handleInputChange}
                  placeholder="Enter your street address"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
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
                        d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={addressData.city}
                    onChange={handleInputChange}
                    placeholder="City name"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cityId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City ID
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
                        d="M10 1a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 6h-1V5a4 4 0 00-4-4zm2 5V5a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="cityId"
                    name="cityId"
                    type="text"
                    value={addressData.cityId}
                    onChange={handleInputChange}
                    placeholder="City ID"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State
                </label>
                <select
                  id="state"
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

              <div>
                <label
                  htmlFor="stateId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State ID
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
                        d="M10 1a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 6h-1V5a4 4 0 00-4-4zm2 5V5a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="stateId"
                    name="stateId"
                    type="text"
                    value={addressData.stateId}
                    onChange={handleInputChange}
                    placeholder="State ID"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ZIP Code
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
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={addressData.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP code"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={addressData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="IN">IN(India)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                onClick={handleCheckAddress}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium"
              >
                Verify Address
              </button>
            </div>
          </form>

          {/* Success Message */}
          {successMsg && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
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
                  <p className="mt-1 text-xs text-green-700">{successMsg}</p>{" "}
                  {/* Typo fix: errorMsg -> successMsg */}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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
                  <p className="mt-1 text-xs text-red-700">{errorMsg}</p>
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

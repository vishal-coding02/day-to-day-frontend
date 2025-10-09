import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { useState } from "react";
import type CustomerRequest from "../interfaces/CustomerRequestInterface";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateCustomerRequest = () => {
  const token = useSelector((state: any) => state.auth.jwtToken);
  const accessToken = localStorage.getItem("accessToken");
  const [request, setRequest] = useState<CustomerRequest>({
    name: "",
    price: "",
    media: "",
    serviceType: [],
    location: "",
    description: "",
  });

  // 🟢 Input Change
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRequest({
      ...request,
      [name]: value,
    });
  };

  // 🟢 Submit Request
  const handleRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Request :", request);

    fetch(`${BACKEND_URL}/customers/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || accessToken}`,
      },
      body: JSON.stringify(request),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Request message:", data.message);
      })
      .catch((err) => {
        console.log("Error :", err.message);
      });

    // Reset
    setRequest({
      name: "",
      price: "",
      media: "",
      serviceType: [],
      location: "",
      description: "",
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setRequest({
        ...request,
        serviceType: Array.isArray(request.serviceType)
          ? [...request.serviceType, value]
          : [value],
      });
    } else {
      setRequest({
        ...request,
        serviceType: Array.isArray(request.serviceType)
          ? request.serviceType.filter((s) => s !== value)
          : [],
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 py-6 px-8 text-white">
              <h1 className="text-2xl font-bold">Create Service Request</h1>
              <p className="mt-2 opacity-90">
                Fill out the form below to create a new service request
              </p>
            </div>

            {/* Form */}
            <form className="p-8" onSubmit={handleRequest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={request.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    placeholder="Enter your full name"
                    onChange={handleInputChange}
                  />
                </div>

                {/* Service Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Budget *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={request.price}
                      className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                      placeholder="Enter your budget"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={request.location}
                    name="location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    placeholder="Enter your location"
                    onChange={handleInputChange}
                  />
                </div>

                {/* Services Needed */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Services Needed *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {[
                      "Plumbing",
                      "Electrical",
                      "Cleaning",
                      "Carpentry",
                      "Painting",
                      "Appliance Repair",
                    ].map((service: string) => (
                      <div key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          name="serviceType"
                          value={service}
                          id={service.toLowerCase()}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onChange={handleCheckboxChange}
                        />
                        <label
                          htmlFor={service.toLowerCase()}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Description *
                  </label>
                  <textarea
                    rows={4}
                    name="description"
                    value={request.description}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    placeholder="Describe the service you need in detail..."
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Upload Media */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Photos (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="media"
                            type="file"
                            value={request.media}
                            className="sr-only"
                            multiple
                            onChange={handleInputChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">
              How it works
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">
                  <svg
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
                <p className="ml-3 text-sm text-blue-700">
                  Describe the service you need in detail
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">
                  <svg
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
                <p className="ml-3 text-sm text-blue-700">
                  Set your budget for the service
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">
                  <svg
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
                <p className="ml-3 text-sm text-blue-700">
                  Providers will contact you with quotes
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">
                  <svg
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
                <p className="ml-3 text-sm text-blue-700">
                  Choose the best provider for your needs
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateCustomerRequest;

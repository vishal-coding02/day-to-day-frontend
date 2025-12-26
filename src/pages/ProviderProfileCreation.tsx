import api from "../api/axios";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type ProviderProfileCreation from "../interfaces/PPCInterface";
import { useNavigate } from "react-router";

interface ProviderProfileResponse {
  message?: string;
}

const PPC = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: any) => state.auth.userData.userId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProviderProfileCreation>({
    id: userId,
    idProf: "",
    name: "",
    servicesList: [],
    image: "",
    bio: "",
    price: {
      pricePerHour: 0,
      workTime: "",
    },
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [customService, setCustomService] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [aadhaarPreview, setAadhaarPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("providerPricing.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        price: {
          ...formData.price,
          [field]: field === "pricePerHour" ? parseInt(value) || 0 : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleServiceSelect = (service: string) => {
    if (!formData.servicesList.includes(service)) {
      setFormData({
        ...formData,
        servicesList: [...formData.servicesList, service],
      });
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleAddCustomService = () => {
    if (
      customService.trim() &&
      !formData.servicesList.includes(customService.trim())
    ) {
      setFormData({
        ...formData,
        servicesList: [...formData.servicesList, customService.trim()],
      });
      setCustomService("");
    }
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      servicesList: formData.servicesList.filter((s) => s !== service),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({
          ...formData,
          image: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAadhaarPreview(result);
        setFormData({
          ...formData,
          idProf: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    if (!userId) {
      console.error("User ID is undefined!");
      return;
    }

    try {
      const res = await api.post<ProviderProfileResponse>(
        "/providers/profileCreation",
        {
          ...formData,
        }
      );

      console.log("Profile created:", res.data);
      navigate("/login");
    } catch (err: any) {
      console.log("Error :", err.response?.data?.message || err.message);
    }
  };

  // Services options
  const serviceOptions: string[] = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Cleaning",
    "Painting",
    "Gardening",
    "Moving & Shifting",
    "Appliance Repair",
    "AC & HVAC Services",
    "Pest Control",
    "Home Renovation",
    "Interior Design",
    "Installation & Assembly",
    "General Repair & Maintenance",
    "Consultation & Inspection",
  ];

  const filteredServices = serviceOptions.filter((service) =>
    service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Your Provider Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your professional profile to start offering services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Step {step} of 4</h2>
              <span className="bg-blue-800 text-xs px-3 py-1 rounded-full">
                {step === 1 && "Basic Info"}
                {step === 2 && "Services"}
                {step === 3 && "Profile Details"}
                {step === 4 && "Review"}
              </span>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-6">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                        stepNumber <= step
                          ? "bg-white text-blue-600 border-white"
                          : "bg-blue-300 border-blue-300 text-white"
                      } font-bold`}
                    >
                      {stepNumber}
                    </div>
                    <span className="text-xs mt-1 text-blue-100">
                      {stepNumber === 1 && "Basic"}
                      {stepNumber === 2 && "Services"}
                      {stepNumber === 3 && "Details"}
                      {stepNumber === 4 && "Review"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Basic Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
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
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          id="providerName"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Sumit Kumar"
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhaar Card Upload *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          ref={aadhaarInputRef}
                          onChange={handleAadhaarUpload}
                          accept="image/*"
                          className="hidden"
                        />

                        {aadhaarPreview ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={aadhaarPreview}
                              alt="Aadhaar preview"
                              className="h-32 object-contain mb-3 border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => aadhaarInputRef.current?.click()}
                              className="text-blue-600 text-sm hover:text-blue-800"
                            >
                              Change Aadhaar
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer"
                            onClick={() => aadhaarInputRef.current?.click()}
                          >
                            <svg
                              className="w-12 h-12 mx-auto mb-3 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-sm text-gray-600">
                              Click to upload Aadhaar card
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium"
                    >
                      Continue to Services
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Services */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Your Services
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search and Add Services *
                    </label>

                    <div className="relative mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          placeholder="Search for services (e.g., Plumber, Electrician)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
                      </div>

                      {showDropdown && searchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                              <div
                                key={service}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                onClick={() => handleServiceSelect(service)}
                              >
                                {service}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No services found. Add a custom service below.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                        placeholder="Add custom service"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomService}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected Services */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Services:
                      </label>
                      {formData.servicesList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.servicesList.map((service) => (
                            <span
                              key={service}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {service}
                              <button
                                type="button"
                                onClick={() => removeService(service)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No services selected yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium"
                    >
                      Continue to Profile Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Profile Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Profile Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Profile Photo
                        </label>
                        <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                          />

                          {imagePreview ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="h-32 w-32 rounded-full object-cover mb-3 border-4 border-white shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 text-sm hover:text-blue-800"
                              >
                                Change Photo
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer py-8"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <svg
                                className="w-12 h-12 mx-auto mb-3 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-sm text-gray-600">
                                Click to upload profile photo
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG up to 5MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-800">
                          Pricing Information
                        </h4>

                        <div>
                          <label
                            htmlFor="pricePerHour"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Price Per Hour (₹) *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">₹</span>
                            </div>
                            <input
                              id="pricePerHour"
                              name="providerPricing.pricePerHour"
                              type="number"
                              value={formData.price.pricePerHour}
                              onChange={handleInputChange}
                              placeholder="e.g., 500"
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                              required
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="workTime"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Standard Work Time *
                          </label>
                          <select
                            id="workTime"
                            name="providerPricing.workTime"
                            value={formData.price.workTime}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                            required
                          >
                            <option value="">Select work time</option>
                            <option value="30min">30 minutes</option>
                            <option value="1hr">1 hour</option>
                            <option value="1.5hr">1.5 hours</option>
                            <option value="2hr">2 hours</option>
                            <option value="2.5hr">2.5 hours</option>
                            <option value="3hr">3 hours</option>
                            <option value="3.5hr">3.5 hours</option>
                            <option value="4hr">4 hours</option>
                            <option value="4+hr">4+ hours</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Professional Bio *
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={8}
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="e.g., 5+ years experience in plumbing and home repair services. Specialized in emergency repairs and maintenance."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        Describe your experience and expertise
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium"
                    >
                      Review Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Review Your Profile
                  </h3>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Name:</span>
                        <span className="font-semibold">
                          {formData.name || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Aadhaar Verified:
                        </span>
                        <span className="font-semibold">
                          {aadhaarPreview ? "✓ Uploaded" : "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Price Per Hour:
                        </span>
                        <span className="font-semibold">
                          ₹{formData.price.pricePerHour || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Work Time:
                        </span>
                        <span className="font-semibold">
                          {formData.price.workTime || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Services:
                        </span>
                        <span className="font-semibold text-right max-w-xs">
                          {formData.servicesList.length > 0
                            ? formData.servicesList.join(", ")
                            : "No services selected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 font-medium">
                          Profile Photo:
                        </span>
                        <span className="font-semibold text-right max-w-xs">
                          {imagePreview ? "✓ Uploaded" : "Not provided"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium block mb-2">
                          Bio:
                        </span>
                        <p className="text-gray-800 bg-white p-4 rounded border border-gray-200">
                          {formData.bio || "No bio provided yet."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-blue-400 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-blue-700">
                        Review your information carefully. You can edit your
                        profile later from your dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 font-medium"
                    >
                      Edit Profile
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 font-medium"
                    >
                      Complete Profile
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPC;

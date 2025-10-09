import { useState } from "react";
import { useSelector } from "react-redux";
import type { Package } from "../interfaces/ServicePackageInterface";
import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ServicePackage = () => {
  const token = useSelector((state: any) => state.auth.jwtToken);
  const accessToken = localStorage.getItem("accessToken");
  const userID = localStorage.getItem("userID");
  const [newPackage, setNewPackage] = useState<Package>({
    id: userID,
    title: "",
    description: "",
    price: 0,
    duration: "",
    servicesIncluded: [],
    deliveryTime: "",
    isActive: true,
  });
  const [currentService, setCurrentService] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [timeUnit, setTimeUnit] = useState("hours");

  const handleAddService = () => {
    if (currentService.trim()) {
      setNewPackage({
        ...newPackage,
        servicesIncluded: [
          ...newPackage.servicesIncluded,
          currentService.trim(),
        ],
      });
      setCurrentService("");
    }
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...newPackage.servicesIncluded];
    updatedServices.splice(index, 1);
    setNewPackage({
      ...newPackage,
      servicesIncluded: updatedServices,
    });
  };

  const handleTimeChange = (value: string, unit: string) => {
    setTimeValue(value);
    setTimeUnit(unit);

    if (value && unit) {
      const durationString = `${value} ${unit}`;
      setNewPackage({
        ...newPackage,
        duration: durationString,
      });
    }
  };

  const handleCreatePackage = () => {
    fetch(`${BACKEND_URL}/packages/addPackages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || accessToken}`,
      },
      body: JSON.stringify(newPackage),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Packages created :", data);
        setNewPackage(data);
      })
      .catch((err) => {
        console.log("Error :", err.message);
      });

    alert(`Package "${newPackage.title}" created successfully!`);
    // Reset form
    setNewPackage({
      id: "",
      title: "",
      description: "",
      price: 0,
      duration: "",
      servicesIncluded: [],
      deliveryTime: "",
      isActive: true,
    });
    setTimeValue("");
    setTimeUnit("hours");
  };

  const resetForm = () => {
    setNewPackage({
      id: "",
      title: "",
      description: "",
      price: 0,
      duration: "",
      servicesIncluded: [],
      deliveryTime: "",
      isActive: true,
    });
    setTimeValue("");
    setTimeUnit("hours");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Create Service Package
            </h1>
            <p className="text-gray-600 text-lg">
              Design attractive service packages for your customers
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Package Title
                  </label>
                  <input
                    type="text"
                    value={newPackage.title}
                    onChange={(e) =>
                      setNewPackage({ ...newPackage, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Premium Home Cleaning"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={newPackage.description}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Describe what this package includes and its benefits"
                    rows={3}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={newPackage.price || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Duration
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={timeValue}
                      onChange={(e) =>
                        handleTimeChange(e.target.value, timeUnit)
                      }
                      className="w-2/3 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 2"
                      min="1"
                    />
                    <select
                      value={timeUnit}
                      onChange={(e) =>
                        handleTimeChange(timeValue, e.target.value)
                      }
                      className="w-1/3 px-2 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    value={newPackage.deliveryTime}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        deliveryTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Within 3 days"
                  />
                </div>

                {/* Services Included */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Services Included
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={currentService}
                      onChange={(e) => setCurrentService(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Add a service (e.g., Deep cleaning)"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddService()
                      }
                    />
                    <button
                      onClick={handleAddService}
                      className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <i className="fas fa-plus mr-1"></i> Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(newPackage.servicesIncluded ?? []).map(
                      (service, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm flex items-center shadow-sm"
                        >
                          {service}
                          <button
                            onClick={() => handleRemoveService(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-3 align-middle select-none">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={newPackage.isActive}
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            isActive: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <label
                        htmlFor="isActive"
                        className={`block h-6 w-10 rounded-full ${
                          newPackage.isActive ? "bg-blue-600" : "bg-gray-300"
                        } cursor-pointer transition-colors`}
                      ></label>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          newPackage.isActive ? "transform translate-x-4" : ""
                        }`}
                      ></div>
                    </div>
                    <label
                      htmlFor="isActive"
                      className="text-gray-700 font-medium"
                    >
                      Package is active and visible to customers
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex justify-end space-x-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset Form
                </button>
                <button
                  onClick={handleCreatePackage}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
                  disabled={
                    !newPackage.title ||
                    !newPackage.description ||
                    newPackage.servicesIncluded.length === 0
                  }
                >
                  Create Package
                </button>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Tips for Creating Effective Packages
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>
                  Use clear and descriptive titles that highlight the package
                  value
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>
                  List all services included to set clear customer expectations
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Price competitively based on market research</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>
                  Be realistic about delivery timelines to maintain trust
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServicePackage;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  Shield,
  Truck,
  CheckCircle,
  ArrowLeft,
  Coins,
  X,
} from "lucide-react";
import api from "../api/axios";
const BOOKING_FEE = 50;

const BookPackagePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);

  const [formData, setFormData] = useState({
    address: "",
    date: "",
    time: "",
    phone: "",
    notes: "",
  });

  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  useEffect(() => {
    if (!isAuthReady) return;
    if (!token) navigate("/login");
  }, [token, isAuthReady, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [packageRes, coinsRes] = await Promise.all([
          api.get(`/packages/${id}`),
          api.get("/coins"),
        ]);

        setPackageDetails(packageRes.data.package);
        setUserCoins(coinsRes.data.userCoins);
      } catch (err) {
        setError("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      await api.post("/booking/book-slot", {
        packageId: id,
        providerId: packageDetails.userID,
        customerAddress: formData.address,
        customerPhone: formData.phone,
        scheduledDate: formData.date,
        scheduledTime: selectedSlot,
        additionalNotes: formData.notes,
        amount: packageDetails.packagePrice,
      });

      setShowPaymentModal(false);

      setFormData({ address: "", date: "", time: "", phone: "", notes: "" });
      setSelectedSlot("");

      setUserCoins((prev) => prev - BOOKING_FEE);

      alert("Booking confirmed successfully!");
    } catch (err: any) {
      setShowPaymentModal(false);
      if (err.response?.data?.message === "Not enough coins") {
        navigate("/coins");
      } else {
        setError("Booking failed. Please try again.");
      }
    }
  };

  const handleBuyCoins = () => {
    setShowPaymentModal(false);
    navigate("/coins");
  };

  const hasSufficientCoins = packageDetails ? userCoins >= BOOKING_FEE : false;

  const coinsNeeded = packageDetails ? BOOKING_FEE - userCoins : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !packageDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "Package not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Packages
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h1 className="text-2xl font-bold text-white">
                  Complete Your Booking
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Fill in the details to schedule your service
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1 text-blue-600" />
                    Service Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full address"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send the professional to this address
                  </p>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1 text-blue-600" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1 text-blue-600" />
                      Preferred Time Slot
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1 text-blue-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Add any special instructions for the service provider (optional)."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                  Proceed to Payment
                </button>

                <p className="text-center text-xs text-gray-500">
                  By proceeding, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </form>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 h-full">
              {/* Package Summary */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Package</p>
                    <p className="font-semibold text-gray-900">
                      {packageDetails.packageTitle}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Provider</p>
                    <p className="font-medium text-gray-800">
                      {packageDetails.providerName}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm text-gray-700">
                        {packageDetails.packageCategory}
                      </p>
                    </div>
                    <div className="bg-blue-100 px-2 py-1 rounded">
                      <p className="text-xs font-medium text-blue-700">
                        {packageDetails.packagesDeliveryTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Service Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Duration: {packageDetails.packageTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Delivery: {packageDetails.packagesDeliveryTime}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="p-6 border-b border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Amount</span>
                    <span className="font-bold text-xl text-blue-600">
                      ₹{packageDetails.packagePrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure payment protected</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free cancellation within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    <span>Multiple payment options available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Coins className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Confirm Booking
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Package Info */}
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {packageDetails.title}
                </p>
                <p className="text-xs text-gray-500">
                  by {packageDetails.providerName}
                </p>
              </div>

              {/* Coin Balance */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Your Coin Balance
                  </span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-lg text-gray-900">
                      {userCoins}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">
                    Package Price
                  </span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-lg text-blue-600">
                      {packageDetails.packagePrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Balance Status */}
              {hasSufficientCoins ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-sm font-medium text-green-700">
                      You have sufficient coins!
                    </p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Remaining coins after booking: {userCoins - BOOKING_FEE}
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    <p className="text-sm font-medium text-red-700">
                      Insufficient Coins!
                    </p>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    You need {coinsNeeded} more coins to book this package
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {hasSufficientCoins ? (
                <button
                  onClick={handleConfirmBooking}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  Confirm & Pay {BOOKING_FEE} Coins
                </button>
              ) : (
                <button
                  onClick={handleBuyCoins}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  Buy More Coins
                </button>
              )}

              {/* Cancel Link */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full mt-3 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookPackagePage;

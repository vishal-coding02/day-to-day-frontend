import { useState, useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import api from "../api/axios";

const PackageBookings = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [bookingsReq, setBookingsReq] = useState([]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!isAuthReady) return;
    if (!token) navigate("/login");
  }, [token, isAuthReady, navigate]);

  const fetchBookingsReq = async () => {
    try {
      const res = await api.get("/booking/provider/request");
      const data = res.data;
      console.log("Customer Bookings Request:", data.bookingsReq);
      setBookingsReq(data.bookingsReq);
    } catch (err: any) {
      console.log("Error :", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchBookingsReq();
  }, [token, isAuthReady]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "booked":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          dotColor: "bg-yellow-500",
          icon: "🟡",
          label: "Booked",
        };
      case "in_progress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          dotColor: "bg-blue-500",
          icon: "🔵",
          label: "In Progress",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          dotColor: "bg-green-500",
          icon: "🟢",
          label: "Completed",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          dotColor: "bg-red-500",
          icon: "🔴",
          label: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          dotColor: "bg-gray-500",
          icon: "⚪",
          label: status,
        };
    }
  };

  const handleCancelClick = (booking: any) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setSelectedBooking(null);
    setCancelReason("");
  };

  const handleConfirmCancel = async () => {
    try {
      await api.patch("booking/provider/cancel", {
        bookingId: selectedBooking._id,
        cancelReason: cancelReason,
      });
      await fetchBookingsReq();
      alert(
        `Booking cancelled Reason: ${cancelReason || "No reason provided"}`,
      );
    } catch (err: any) {
      console.log("Booking Error : ", err.message);
      alert(err.response?.data?.message || "Cancel failed. Try again.");
    }

    handleCloseModal();
  };

  const filteredBookings = bookingsReq.filter((booking: any) => {
    const matchesSearch =
      booking.customerId?.userName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.customerId?.userPhone?.includes(searchTerm) ||
      booking.packageId?.packageTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = false;
    if (filterStatus === "all") {
      matchesStatus = true;
    } else if (filterStatus === "cancelled") {
      matchesStatus =
        booking.status === "cancelled_by_provider" ||
        booking.status === "cancelled_by_customer";
    } else {
      matchesStatus = booking.status === filterStatus;
    }

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookingsReq.length,
    booked: bookingsReq.filter((b: any) => b.status === "booked").length,
    inProgress: bookingsReq.filter((b: any) => b.status === "in_progress")
      .length,
    completed: bookingsReq.filter((b: any) => b.status === "completed").length,
    cancelled: bookingsReq.filter(
      (b: any) =>
        b.status === "cancelled_by_provider" ||
        b.status === "cancelled_by_customer",
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Package Bookings
          </h1>
          <p className="text-gray-600">
            Manage all your incoming service bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-xs text-gray-500 mb-1">🟡 Booked</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.booked}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-xs text-gray-500 mb-1">🔵 In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-xs text-gray-500 mb-1">🟢 Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <p className="text-xs text-gray-500 mb-1">🔴 Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, phone, package, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
              {["all", "booked", "in_progress", "completed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      filterStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : status === "booked"
                        ? "Booked"
                        : status === "in_progress"
                          ? "In Progress"
                          : status === "completed"
                            ? "Completed"
                            : "Cancelled"}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bookings Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredBookings.length}</span>{" "}
            bookings
          </p>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <User className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-lg text-gray-900">
                          {booking.customerId?.userName || "N/A"}
                        </h3>
                        <span className="text-xs text-gray-400 ml-2">
                          ID: {booking._id?.slice(0, 8) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}
                          ></span>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Customer Contact */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Phone:</span>
                          {booking.status === "cancelled_by_provider" ||
                          booking.status === "cancelled_by_customer" ? (
                            <span className="text-gray-400 italic">
                              unavailable
                            </span>
                          ) : (
                            <span className="font-medium text-gray-800">
                              {booking.customerPhone || "N/A"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">Address:</span>
                          <span className="text-gray-800">
                            {booking.customerAddress || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Schedule & Package */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-800">
                            {booking.scheduledDate
                              ? new Date(
                                  booking.scheduledDate,
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium text-gray-800">
                            {booking.scheduledTime || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium text-gray-800">
                            {booking.packageId?.packageTitle || "N/A"} (₹
                            {booking.amount || 0})
                          </span>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      {booking.additionalNotes && (
                        <div className="md:col-span-2">
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Notes:</span>
                            <span className="text-gray-700 italic">
                              "{booking.additionalNotes}"
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Based on Status */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      {booking.status === "booked" && (
                        <>
                          <button
                            // onClick={() => handleMarkInProgress(booking._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "in_progress" && (
                        <>
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                            onClick={() => alert("Mark as Completed (UI Only)")}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Completed
                          </button>
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "completed" && (
                        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </button>
                      )}
                      {booking.status === "cancelled" && (
                        <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Cancelled
                        </button>
                      )}
                      <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors ml-auto flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cancel Booking
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Booking Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-semibold text-gray-900">
                  {selectedBooking?.customerId?.userName || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Package</p>
                <p className="font-medium text-gray-800">
                  {selectedBooking?.packageId?.packageTitle || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Date & Time</p>
                <p className="font-medium text-gray-800">
                  {selectedBooking?.scheduledDate
                    ? new Date(
                        selectedBooking.scheduledDate,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}{" "}
                  - {selectedBooking?.scheduledTime || "N/A"}
                </p>
              </div>

              {/* Cancel Reason Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Please provide a reason for cancelling this booking..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be shared with the customer
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PackageBookings;

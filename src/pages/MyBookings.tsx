import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Coins,
  Package,
  User,
  ChevronRight,
  Filter,
  Search,
  AlertCircle,
  XCircle,
} from "lucide-react";
import api from "../api/axios";

const MyBookings = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.jwtToken);
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!token) navigate("/login");
  }, [token, isAuthReady, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/booking/customer");
      const data = res.data;
      console.log("Customer Bookings :", data.bookings);
      setBookings(data.bookings);
    } catch (err: any) {
      console.log("Error :", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token, isAuthReady]);

  const cancelBooking = async (bookingId: string) => {
    try {
      await api.patch(`/booking/customer/cancel/${bookingId}/`);
      await fetchBookings();
      alert("Booking cancelled. coins refunded.");
    } catch (err: any) {
      console.log("Booking Error : ", err.message);
      alert(err.response?.data?.message || "Cancel failed. Try again.");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "booked":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          dotColor: "bg-yellow-500",
          label: "Booked",
          icon: "🟡",
        };
      case "in_progress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          dotColor: "bg-blue-500",
          label: "In Progress",
          icon: "🔵",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          dotColor: "bg-green-500",
          label: "Completed",
          icon: "🟢",
        };
      case "cancelled_by_customer":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          dotColor: "bg-red-500",
          label: "Cancelled by You",
          icon: "🔴",
        };
      case "cancelled_by_provider":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          dotColor: "bg-red-500",
          label: "Cancelled by Provider",
          icon: "🔴",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          dotColor: "bg-gray-500",
          label: status,
          icon: "⚪",
        };
    }
  };

  const filteredBookings = bookings.filter((booking: any) => {
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      booking.packageId?.packageTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.providerId?.userName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Track and manage all your service bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
            <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-xs text-gray-500 mb-1">🟡 Booked</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter((b: any) => b.status === "booked").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-xs text-gray-500 mb-1">🔵 In Progress</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter((b: any) => b.status === "in_progress").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-xs text-gray-500 mb-1">🟢 Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter((b: any) => b.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by package name, provider, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
              {[
                "all",
                "booked",
                "in_progress",
                "completed",
                "cancelled_by_customer",
                "cancelled_by_provider",
              ].map((status) => (
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
                    : status === "in_progress"
                      ? "In Progress"
                      : status === "cancelled_by_customer"
                        ? "Cancelled (You)"
                        : status === "cancelled_by_provider"
                          ? "Cancelled (Provider)"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredBookings.length}</span>{" "}
            bookings
          </p>
        </div>

        {/* Bookings List */}
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
            <button
              onClick={() => navigate("/all-packages")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Packages
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => {
              const statusConfig = getStatusConfig(booking.status);
              const isCancelled =
                booking.status === "cancelled_by_customer" ||
                booking.status === "cancelled_by_provider";

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-lg text-gray-900">
                          {booking.packageId?.packageTitle}
                        </h3>
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
                        <span className="text-xs text-gray-500">
                          ID: {booking._id?.slice(0, 8) || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Provider:</span>
                          <span className="font-medium text-gray-800">
                            {booking.providerId?.userName || "N/A"}
                          </span>
                        </div>
                        {!isCancelled && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium text-gray-800">
                              {booking.providerId?.userPhone || "N/A"}
                            </span>
                          </div>
                        )}
                        {isCancelled && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">
                              Phone unavailable
                            </span>
                          </div>
                        )}
                      </div>

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
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">Address:</span>
                          <span className="text-gray-800">
                            {booking.customerAddress || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600">Amount Paid:</span>
                          <span className="font-semibold text-blue-600">
                            {booking.coinsCharged || 0} Coins
                          </span>
                        </div>
                      </div>

                      {booking.status === "cancelled_by_provider" &&
                        booking.providerReasonForCancellation && (
                          <div className="md:col-span-2">
                            <div className="flex items-start gap-2 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-sm font-semibold text-red-700">
                                  Cancellation Reason:
                                </span>
                                <p className="text-sm text-red-600 mt-0.5">
                                  {booking.providerReasonForCancellation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      {booking.status === "cancelled_by_customer" && (
                        <div className="md:col-span-2">
                          <div className="flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">
                              You cancelled this booking. Coins have been
                              refunded.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      {booking.status === "booked" && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                      {booking.status === "in_progress" && (
                        <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                          Track Service
                        </button>
                      )}
                      {booking.status === "completed" && (
                        <button className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                          Write a Review
                        </button>
                      )}
                      {(booking.status === "cancelled_by_customer" ||
                        booking.status === "cancelled_by_provider") && (
                        <button
                          onClick={() => navigate("/all-packages")}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          Book Again
                        </button>
                      )}
                      <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors ml-auto">
                        View Details
                        <ChevronRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;

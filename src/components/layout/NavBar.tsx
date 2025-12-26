import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const NavBar = () => {
  const userType = localStorage.getItem("userType");
  const token = useSelector((state: any) => state.auth.jwtToken);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userID = localStorage.getItem("userID");
  const [userCoins, setUserCoins] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!token) return;

    const fetchCoins = async () => {
      try {
        const res = await api.get("/coins");

        console.log("Coins :", res.data.userCoins);
        setUserCoins(res.data.userCoins);
      } catch (err: any) {
        console.log("Error :", err.response?.data?.message || err.message);
      }
    };

    fetchCoins();
  }, [userCoins, token]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">ServiceHub</h1>
            </div>
            <div className="hidden md:block ml-8">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  About
                </Link>
                {token && userType === "admin" && (
                  <Link
                    to="/adminDashBoard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Admin DashBoard
                  </Link>
                )}
                <Link
                  to="/coins"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Buy Coins
                </Link>
                {token && userType === "provider" && (
                  <>
                    <Link
                      to="/providerDashBoard"
                      className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Provider DashBoard
                    </Link>
                    <Link
                      to={`/providerProfile/${userID}`}
                      className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/packages"
                      className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Create Service Package
                    </Link>
                  </>
                )}
                {token && userType === "customer" && (
                  <>
                    <Link
                      to="/findProviders"
                      className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Find Providers
                    </Link>
                    <Link
                      to="/postRequirement"
                      className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Post Requirement
                    </Link>
                    <Link
                      to={`/customerProfile/${userID}`}
                      className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Customer Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side of navbar */}
          <div className="flex items-center space-x-4">
            {/* Coins display - only show for logged-in users */}
            {token && (
              <div className="hidden md:flex items-center px-4 py-2 rounded-full shadow-sm bg-white">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-coins text-yellow-800 text-xs"></i>
                </div>
                <span className="font-semibold text-gray-700">
                  <span className="text-indigo-600">{userCoins || 0}</span>{" "}
                  coins
                </span>
              </div>
            )}

            {/* Desktop Auth Buttons */}
            {!token && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
            {/* Coins display in mobile menu */}
            {token && (
              <div className="flex items-center px-3 py-2">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-coins text-yellow-800 text-xs"></i>
                </div>
                <span className="font-semibold text-gray-700">
                  <span className="text-indigo-600">{userCoins || 0}</span>{" "}
                  coins
                </span>
              </div>
            )}

            <Link
              to="/"
              className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/coins"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Buy Coins
            </Link>
            {token && userType === "provider" && (
              <>
                <Link
                  to="/providerDashBoard"
                  className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Provider DashBoard
                </Link>
                <Link
                  to={`/providerProfile/${userID}`}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/packages"
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Service Package
                </Link>
              </>
            )}
            {token && userType === "customer" && (
              <>
                <Link
                  to="/findProviders"
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Providers
                </Link>
                <Link
                  to="/postRequirement"
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Requirement
                </Link>
                <Link
                  to={`/customerProfile/${userID}`}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Customer Profile
                </Link>
              </>
            )}
            {/* Mobile Auth Buttons (visible only when logged out) */}
            {!token && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="w-full text-center bg-gray-200 text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

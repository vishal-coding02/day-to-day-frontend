import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthInitializer from "./components/AuthInitializer.tsx";
import "./index.css";
import "./api/interceptors.js";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login.tsx";
import PPC from "./pages/ProviderProfileCreation.tsx";
import Address from "./components/Address.tsx";
import { Provider } from "react-redux";
import store from "./redux/Store.ts";
import OTPVerification from "./pages/Otp.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashBoard.tsx";
import ReviewProviderProfile from "./admin/ReviewProviderProfile.tsx";
import ProviderDashBoard from "./pages/ProviderDashBoard.tsx";
import ProviderReviewPending from "./components/ProviderReviewPending.tsx";
import HomePage from "./pages/HomePage.tsx";
import FindProviders from "./pages/FindProviders.tsx";
import CreateCustomerRequest from "./pages/CreateCustomerRequest.tsx";
import ProviderProfile from "./pages/ProviderProfile.tsx";
import ServicePackage from "./pages/ProviderPackages.tsx";
import BuyCoins from "./pages/BuyCoins.tsx";
import CustomerProfile from "./pages/CustomerProfile.tsx";
import RejectedProvider from "./components/RejectedProvider.tsx";
import AboutUs from "./pages/AboutPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/address",
    element: <Address />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/providerProfileCreation",
    element: <PPC />,
  },
  {
    path: "/otpVerification",
    element: <OTPVerification />,
  },
  {
    path: "/adminDashBoard",
    element: <AdminDashboard />,
  },
  {
    path: "/reviewProviderProfile/:id",
    element: <ReviewProviderProfile />,
  },
  {
    path: "/providerDashBoard",
    element: <ProviderDashBoard />,
  },
  {
    path: "/providerReviews/:id",
    element: <ProviderReviewPending />,
  },
  {
    path: "/findProviders",
    element: <FindProviders />,
  },
  {
    path: "/postRequirement",
    element: <CreateCustomerRequest />,
  },
  {
    path: "/providerProfile/:id",
    element: <ProviderProfile />,
  },
  {
    path: "/packages",
    element: <ServicePackage />,
  },
  {
    path: "/coins",
    element: <BuyCoins />,
  },
  {
    path: "customerProfile/:id",
    element: <CustomerProfile />,
  },
  {
    path: "/rejectedProvider",
    element: <RejectedProvider />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  </StrictMode>
);

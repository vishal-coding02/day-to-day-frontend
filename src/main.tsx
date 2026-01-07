import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import AuthInitializer from "./components/AuthInitializer.tsx";
import "./index.css";
import "./api/interceptors.js";
const SignUp = lazy(() => import("./pages/SignUp.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const PPC = lazy(() => import("./pages/ProviderProfileCreation.tsx"));
const Address = lazy(() => import("./components/Address.tsx"));
import { Provider } from "react-redux";
import store from "./redux/Store.ts";
const OTPVerification = lazy(() => import("./pages/Otp.tsx"));
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const AdminDashboard = lazy(() => import("./admin/AdminDashBoard.tsx"));
const ReviewProviderProfile = lazy(
  () => import("./admin/ReviewProviderProfile.tsx")
);
const ProviderDashBoard = lazy(() => import("./pages/ProviderDashBoard.tsx"));
const ProviderReviewPending = lazy(
  () => import("./components/ProviderReviewPending.tsx")
);
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const FindProviders = lazy(() => import("./pages/FindProviders.tsx"));
const CreateCustomerRequest = lazy(
  () => import("./pages/CreateCustomerRequest.tsx")
);
const ProviderProfile = lazy(() => import("./pages/ProviderProfile.tsx"));
const ServicePackage = lazy(() => import("./pages/ProviderPackages.tsx"));
const BuyCoins = lazy(() => import("./pages/BuyCoins.tsx"));
const CustomerProfile = lazy(() => import("./pages/CustomerProfile.tsx"));
const RejectedProvider = lazy(
  () => import("./components/RejectedProvider.tsx")
);
const AboutUs = lazy(() => import("./pages/AboutPage"));
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
  <Provider store={store}>
    <AuthInitializer>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </AuthInitializer>
  </Provider>
);

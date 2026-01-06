import { lazy, Suspense } from "react";
const CommonHome = lazy(() => import("./CommonHome"));
const ProviderHomePage = lazy(() => import("./ProviderHome"));
const CustomerHomePage = lazy(() => import("./CustomerHome"));

const HomePage = () => {
  const userType = localStorage.getItem("userType");

  if (userType === "customer") {
    return (
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
        <CustomerHomePage />
      </Suspense>
    );
  }

  if (userType === "provider") {
    return (
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
        <ProviderHomePage />
      </Suspense>
    );
  }

  return (
    <Suspense>
      <CommonHome />
    </Suspense>
  );
};

export default HomePage;

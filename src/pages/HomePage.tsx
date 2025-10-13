import CommonHome from "./CommonHome";
import ProviderHomePage from "./ProviderHome";
import CustomerHomePage from "./CustomerHome";

const HomePage = () => {
  const userType = localStorage.getItem("userType");

  if (userType === "customer") {
    return <CustomerHomePage />;
  }

  if (userType === "provider") {
    return <ProviderHomePage />;
  }

  return <CommonHome />;
};

export default HomePage;

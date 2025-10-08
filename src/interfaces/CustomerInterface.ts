export default interface CustomerProfile {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userType: "customer" | "provider" | "admin";
  coins: number;
  profilePic?: string;
  providerContactList?: {
    _id: string;
    userName: string;
    userPhone: string;
  }[];
  userAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  createdAt?: string;
}

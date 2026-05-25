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

export interface CustomerContactData {
  _id: string;
  requestID: string;
  providerID: string;
  customerID: string;
  providerName: string;
  customerName: string;
  customerNumber: string;
  servicesNeeded: string[];
  offeredPrice: number;
  coinsSpent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseContactResponse {
  updatedCoins: number;
  message?: string;
}
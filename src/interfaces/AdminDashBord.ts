interface UserData {
  userName: string;
  userPhone: string;
  userType: string;
  createdAt: string;
  userAddress?: {
    addressType: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface ProviderData {
  providerName: string;
  providerImageUrl: string;
  providerAvgRating: number;
  providerTotalJobs: number;
  providerBio: string;
  providerServicesList: string[];
  providerIdProf: string;
  status: "pending" | "approved" | "rejected";
}

export default interface ProviderInfoResponse {
  userData: UserData;
  providerData: ProviderData;
}

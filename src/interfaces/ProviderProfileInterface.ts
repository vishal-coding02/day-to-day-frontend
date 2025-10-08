export default interface ProviderProfileData {
  _id?: string;
  providerName?: string;
  providerBio?: string;
  providerImageUrl?: string;
  providerIdProf?: string;
  providerServicesList: string[];
  providerAvgRating: number;
  providerPricing: {
    pricePerHour: number;
    workTime: string;
  };
  providerTotalJobs?: number;
  createdAt?: string | number | Date;
  status: string;
  userID?: {
    _id?: string;
    userName?: string;
    userPhone?: string;
    userAddress?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
}

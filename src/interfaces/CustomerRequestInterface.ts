export default interface CustomerRequest {
  name: string;
  price: string;
  media: string;
  serviceType: string[];
  location: string;
  description: string;
}

export interface Provider {
  _id: string;
  providerName: string;
  providerBio: string;
  providerImageUrl: string;
  providerServicesList: string[];
  providerAvgRating: number;
  providerPricing: {
    pricePerHour: number;
    workTime: string;
  };
}

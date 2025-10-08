export interface Package {
  id: string | null;
  title: string;
  description: string;
  price: number;
  duration: string;
  servicesIncluded: string[];
  deliveryTime: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServicePackage {
  _id: string;
  packageTitle: string;
  packageDescription: string;
  packagePrice: number;
  packageTime: string;
  packagesDeliveryTime: string;
  packageServicesList: string[];
  packageStatus: boolean;
  providerName: string;
  userID: string;
}

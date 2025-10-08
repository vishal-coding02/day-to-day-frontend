export default interface ProviderProfileCreation {
  id: string;
  idProf: string;
  name: string;
  servicesList: string[];
  image: string;
  bio: string;
  price: {
    pricePerHour: number;
    workTime: string;
  };
}

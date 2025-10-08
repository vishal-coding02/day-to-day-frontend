export default interface Request {
  _id: string;
  userID: string;
  customerName: string;
  customerLocation: string;
  customerDescription: string;
  customerPrice: number;
  customerServicesList: string[];
  customerMedia?: string;
  createdAt: string;
  status?: string;
}

export interface WashType {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
}

export interface WashHistory {
  id: string;
  date: string;
  washType: WashType;
  station: {
    id: string;
    name: string;
  };
  licensePlate: string;
  duration: number;
  price: number;
  paymentMethod: string;
  services: string[];
  extras?: {
    name: string;
    price: number;
  }[];
  discount?: {
    name: string;
    amount: number;
  };
}
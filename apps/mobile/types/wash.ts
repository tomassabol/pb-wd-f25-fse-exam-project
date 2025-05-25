import { type WashType as DBWashType } from "../../api/db/schema/wash-type.schema";

// Extended wash type for UI with additional properties
export interface WashType extends DBWashType {
  imageUrl: string;
  features: string[]; // Derived from includedFeatures for UI compatibility
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

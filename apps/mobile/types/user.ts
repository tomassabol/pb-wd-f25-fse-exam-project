import { WashType } from './wash';
import { Station } from './station';

export interface RecentWash {
  id: string;
  date: string;
  washType: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  station: {
    id: string;
    name: string;
  };
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  licensePlate: string;
  hasSubscription: boolean;
  recentWashes?: RecentWash[];
}
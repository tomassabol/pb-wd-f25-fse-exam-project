export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Station {
  id: string;
  name: string;
  type: ("manual" | "automatic")[];
  address: string;
  coordinate: Coordinate;
  rating: number;
  distance: number;
  isOpen: boolean;
  hours: string;
  waitTime: number;
  isFavorite: boolean;
  isPremium: boolean;
  imageUrl: string;
  phone: string;
  description: string;
  services: string[];
}

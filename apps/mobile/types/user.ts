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

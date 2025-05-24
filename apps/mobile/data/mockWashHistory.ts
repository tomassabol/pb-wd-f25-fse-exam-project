import { WashHistory } from '@/types/wash';

export const mockWashHistory: WashHistory[] = [
  {
    id: '1',
    date: 'June 15, 2023 • 14:30',
    washType: {
      id: '2',
      name: 'Premium Wash',
      price: 129,
      imageUrl: 'https://images.pexels.com/photos/6873039/pexels-photo-6873039.jpeg',
      features: [
        'Pre-soak',
        'Triple foam polish',
        'Wax protection',
        'Undercarriage wash',
        'Spot-free rinse',
        'Air dry'
      ]
    },
    station: {
      id: '1',
      name: 'WashWorld Copenhagen Central',
    },
    licensePlate: 'AB 12 345',
    duration: 12,
    price: 129,
    paymentMethod: 'Credit Card',
    services: [
      'Triple foam polish',
      'Wax protection',
      'Undercarriage wash',
      'Spot-free rinse',
      'Air dry'
    ]
  },
  {
    id: '2',
    date: 'May 30, 2023 • 10:15',
    washType: {
      id: '3',
      name: 'Deluxe Wash',
      price: 179,
      imageUrl: 'https://images.pexels.com/photos/4700420/pexels-photo-4700420.jpeg',
      features: [
        'Pre-soak',
        'Triple foam polish',
        'Ceramic coating',
        'Hot wax treatment',
        'Tire shine',
        'Rain repellent',
        'Undercarriage wash',
        'Spot-free rinse',
        'Air dry'
      ]
    },
    station: {
      id: '3',
      name: 'WashWorld Odense East',
    },
    licensePlate: 'AB 12 345',
    duration: 15,
    price: 179,
    paymentMethod: 'Membership',
    services: [
      'Pre-soak',
      'Triple foam polish',
      'Ceramic coating',
      'Hot wax treatment',
      'Tire shine',
      'Rain repellent',
      'Undercarriage wash',
      'Spot-free rinse',
      'Air dry'
    ],
    discount: {
      name: 'Membership Discount',
      amount: 35
    }
  },
  {
    id: '3',
    date: 'May 12, 2023 • 16:45',
    washType: {
      id: '1',
      name: 'Basic Wash',
      price: 79,
      imageUrl: 'https://images.pexels.com/photos/6873028/pexels-photo-6873028.jpeg',
      features: [
        'Pre-soak',
        'High-pressure rinse',
        'Air dry'
      ]
    },
    station: {
      id: '2',
      name: 'WashWorld Aarhus North',
    },
    licensePlate: 'AB 12 345',
    duration: 8,
    price: 79,
    paymentMethod: 'Credit Card',
    services: [
      'Pre-soak',
      'High-pressure rinse',
      'Air dry'
    ]
  },
  {
    id: '4',
    date: 'April 28, 2023 • 09:20',
    washType: {
      id: '2',
      name: 'Premium Wash',
      price: 129,
      imageUrl: 'https://images.pexels.com/photos/6873039/pexels-photo-6873039.jpeg',
      features: [
        'Pre-soak',
        'Triple foam polish',
        'Wax protection',
        'Undercarriage wash',
        'Spot-free rinse',
        'Air dry'
      ]
    },
    station: {
      id: '6',
      name: 'WashWorld Roskilde West',
    },
    licensePlate: 'AB 12 345',
    duration: 12,
    price: 129,
    paymentMethod: 'Membership',
    services: [
      'Pre-soak',
      'Triple foam polish',
      'Wax protection',
      'Undercarriage wash',
      'Spot-free rinse',
      'Air dry'
    ]
  },
  {
    id: '5',
    date: 'April 10, 2023 • 14:00',
    washType: {
      id: '3',
      name: 'Deluxe Wash',
      price: 179,
      imageUrl: 'https://images.pexels.com/photos/4700420/pexels-photo-4700420.jpeg',
      features: [
        'Pre-soak',
        'Triple foam polish',
        'Ceramic coating',
        'Hot wax treatment',
        'Tire shine',
        'Rain repellent',
        'Undercarriage wash',
        'Spot-free rinse',
        'Air dry'
      ]
    },
    station: {
      id: '1',
      name: 'WashWorld Copenhagen Central',
    },
    licensePlate: 'AB 12 345',
    duration: 15,
    price: 179,
    paymentMethod: 'Credit Card',
    services: [
      'Pre-soak',
      'Triple foam polish',
      'Ceramic coating',
      'Hot wax treatment',
      'Tire shine',
      'Rain repellent',
      'Undercarriage wash',
      'Spot-free rinse',
      'Air dry'
    ],
    extras: [
      {
        name: 'Interior Cleaning',
        price: 50
      }
    ]
  }
];
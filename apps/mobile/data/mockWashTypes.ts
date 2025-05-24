import { WashType } from '@/types/wash';

export const mockWashTypes: WashType[] = [
  {
    id: '1',
    name: 'Basic Wash',
    description: 'Quick exterior wash with pre-soak, high-pressure rinse, and air dry.',
    price: 79,
    imageUrl: 'https://images.pexels.com/photos/6873028/pexels-photo-6873028.jpeg',
    features: [
      'Pre-soak',
      'High-pressure rinse',
      'Air dry'
    ]
  },
  {
    id: '2',
    name: 'Premium Wash',
    description: 'Complete exterior wash with triple foam polish, wax, undercarriage wash, and spot-free rinse.',
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
  {
    id: '3',
    name: 'Deluxe Wash',
    description: 'Our most comprehensive wash including ceramic coating, tire shine, rain repellent, and hot wax treatment.',
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
  {
    id: '4',
    name: 'Express Wash',
    description: 'Quick and efficient wash for when you\'re in a hurry. Basic exterior cleaning in just 5 minutes.',
    price: 59,
    imageUrl: 'https://images.pexels.com/photos/4700415/pexels-photo-4700415.jpeg',
    features: [
      'Pre-soak',
      'Basic rinse',
      'Quick dry'
    ]
  }
];
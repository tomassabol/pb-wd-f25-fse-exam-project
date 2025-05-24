import { Station } from '@/types/station';

export const mockStations: Station[] = [
  {
    id: '1',
    name: 'WashWorld Copenhagen Central',
    type: 'automatic',
    address: 'Vesterbrogade 45, 1620 Copenhagen',
    coordinate: {
      latitude: 55.6761,
      longitude: 12.5683,
    },
    rating: 4.8,
    distance: 1.2,
    isOpen: true,
    hours: '07:00 - 22:00',
    waitTime: 5,
    isFavorite: true,
    isPremium: true,
    imageUrl: 'https://images.pexels.com/photos/6873028/pexels-photo-6873028.jpeg',
    phone: '+45 12 34 56 78',
    description: 'Our flagship location in central Copenhagen featuring state-of-the-art automatic wash technology. Enjoy premium services with minimal wait times.',
    services: [
      'Touchless Wash',
      'Undercarriage Wash',
      'Wax Treatment',
      'Interior Vacuuming',
      'Tire Shine',
      'Air Freshener',
      'Rain Repellent'
    ]
  },
  {
    id: '2',
    name: 'WashWorld Aarhus North',
    type: 'manual',
    address: 'Randersvej 100, 8200 Aarhus N',
    coordinate: {
      latitude: 56.1780,
      longitude: 10.1885,
    },
    rating: 4.5,
    distance: 0.8,
    isOpen: true,
    hours: '06:00 - 23:00',
    waitTime: 0,
    isFavorite: false,
    isPremium: false,
    imageUrl: 'https://images.pexels.com/photos/6873039/pexels-photo-6873039.jpeg',
    phone: '+45 23 45 67 89',
    description: 'High-quality manual wash station in North Aarhus. Equipped with premium pressure washers and cleaning solutions for a personalized washing experience.',
    services: [
      'High-Pressure Wash',
      'Foam Brush',
      'Spot-Free Rinse',
      'Vacuum Stations',
      'Carpet Cleaner',
      'Air Machine'
    ]
  },
  {
    id: '3',
    name: 'WashWorld Odense East',
    type: 'automatic',
    address: 'Ørbækvej 75, 5220 Odense',
    coordinate: {
      latitude: 55.3908,
      longitude: 10.4312,
    },
    rating: 4.3,
    distance: 2.5,
    isOpen: true,
    hours: '07:00 - 21:00',
    waitTime: 10,
    isFavorite: true,
    isPremium: true,
    imageUrl: 'https://images.pexels.com/photos/4700420/pexels-photo-4700420.jpeg',
    phone: '+45 34 56 78 90',
    description: 'Modern automatic wash facility in East Odense with eco-friendly wash options. Features the latest technology for a gentle yet effective clean.',
    services: [
      'Touchless Wash',
      'Triple Foam Polish',
      'Hot Wax Treatment',
      'Wheel Cleaning',
      'Undercarriage Rinse',
      'Spot-Free Rinse'
    ]
  },
  {
    id: '4',
    name: 'WashWorld Aalborg South',
    type: 'manual',
    address: 'Hobrovej 220, 9000 Aalborg',
    coordinate: {
      latitude: 57.0321,
      longitude: 9.9122,
    },
    rating: 4.1,
    distance: 3.1,
    isOpen: false,
    hours: '08:00 - 20:00',
    waitTime: 0,
    isFavorite: false,
    isPremium: false,
    imageUrl: 'https://images.pexels.com/photos/4700415/pexels-photo-4700415.jpeg',
    phone: '+45 45 67 89 01',
    description: 'Self-service wash bays in South Aalborg with powerful equipment and high-quality cleaning products. Perfect for those who prefer to wash their own vehicles.',
    services: [
      'High-Pressure Wash',
      'Foam Brush',
      'Wax Application',
      'Interior Cleaning',
      'Air Machine'
    ]
  },
  {
    id: '5',
    name: 'WashWorld Esbjerg Central',
    type: 'automatic',
    address: 'Stormgade 150, 6700 Esbjerg',
    coordinate: {
      latitude: 55.4678,
      longitude: 8.4595,
    },
    rating: 4.6,
    distance: 1.7,
    isOpen: true,
    hours: '07:00 - 22:00',
    waitTime: 15,
    isFavorite: false,
    isPremium: true,
    imageUrl: 'https://images.pexels.com/photos/2769241/pexels-photo-2769241.jpeg',
    phone: '+45 56 78 90 12',
    description: 'Premium wash facility in central Esbjerg with both automatic and self-service options. Features environmentally friendly cleaning solutions.',
    services: [
      'Soft-Touch Wash',
      'Triple Foam Polish',
      'Ceramic Coating',
      'Tire Shine',
      'Air Freshener',
      'Interior Detailing'
    ]
  },
  {
    id: '6',
    name: 'WashWorld Roskilde West',
    type: 'manual',
    address: 'Københavnsvej 60, 4000 Roskilde',
    coordinate: {
      latitude: 55.6463,
      longitude: 12.0713,
    },
    rating: 4.2,
    distance: 4.3,
    isOpen: true,
    hours: '06:00 - 23:00',
    waitTime: 0,
    isFavorite: true,
    isPremium: false,
    imageUrl: 'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg',
    phone: '+45 67 89 01 23',
    description: 'Convenient manual wash location in West Roskilde with 24/7 access for members. Clean and well-maintained equipment for a thorough wash.',
    services: [
      'Self-Service Bays',
      'Foam Cannon',
      'Spot-Free Rinse',
      'Vacuum Stations',
      'Mat Cleaning'
    ]
  }
];
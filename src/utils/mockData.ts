export interface NGO {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  phone: string;
  email: string;
  acceptedFoodTypes: string[];
}

export interface RecyclingHub {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  phone: string;
  acceptedMaterials: string[];
  operatingHours: string;
}

export interface DonationRecord {
  id: string;
  ngoId: string;
  ngoName: string;
  foodType: string;
  quantity: number;
  unit: string;
  date: string;
  status: 'pending' | 'collected' | 'delivered';
}

export interface CompostSession {
  id: string;
  wasteItems: string[];
  guidance: string;
  date: string;
}

export interface PlantRecord {
  id: string;
  name: string;
  datePlanted: string;
  photo?: string;
}

export interface RecyclingDelivery {
  id: string;
  hubId: string;
  hubName: string;
  materials: string[];
  date: string;
  status: 'pending' | 'delivered';
}

// Mock NGOs data
export const mockNGOs: NGO[] = [
  {
    id: '1',
    name: 'Green Valley Food Bank',
    description: 'Serving the community for over 20 years with fresh food distribution.',
    address: '123 Community St, Green Valley, CA 90210',
    latitude: 34.0522,
    longitude: -118.2437,
    phone: '(555) 123-4567',
    email: 'contact@greenvalleyfoodbank.org',
    acceptedFoodTypes: ['vegetables', 'fruits', 'grains', 'dairy', 'prepared meals']
  },
  {
    id: '2',
    name: 'Hope Kitchen Network',
    description: 'Daily meal preparation and food rescue operations.',
    address: '456 Hope Ave, Los Angeles, CA 90211',
    latitude: 34.0736,
    longitude: -118.4004,
    phone: '(555) 234-5678',
    email: 'info@hopekitchen.org',
    acceptedFoodTypes: ['vegetables', 'fruits', 'prepared meals', 'bakery items']
  },
  {
    id: '3',
    name: 'Community Harvest',
    description: 'Redistributing surplus food to families in need.',
    address: '789 Harvest Rd, Beverly Hills, CA 90212',
    latitude: 34.0736,
    longitude: -118.4004,
    phone: '(555) 345-6789',
    email: 'donate@communityharvest.org',
    acceptedFoodTypes: ['vegetables', 'fruits', 'grains', 'canned goods']
  },
  {
    id: '4',
    name: 'Nourish LA',
    description: 'Mobile food distribution serving underserved communities.',
    address: '321 Nourish Blvd, Santa Monica, CA 90401',
    latitude: 34.0195,
    longitude: -118.4912,
    phone: '(555) 456-7890',
    email: 'help@nourishla.org',
    acceptedFoodTypes: ['vegetables', 'fruits', 'dairy', 'prepared meals', 'pantry staples']
  },
  {
    id: '5',
    name: 'Fresh Start Foundation',
    description: 'Emergency food assistance and nutrition education programs.',
    address: '654 Fresh St, West Hollywood, CA 90069',
    latitude: 34.0900,
    longitude: -118.3617,
    phone: '(555) 567-8901',
    email: 'support@freshstartfoundation.org',
    acceptedFoodTypes: ['vegetables', 'fruits', 'grains', 'protein', 'dairy']
  }
];

// Mock Recycling Hubs data
export const mockRecyclingHubs: RecyclingHub[] = [
  {
    id: '1',
    name: 'EcoCenter Los Angeles',
    address: '1234 Recycle Way, Los Angeles, CA 90013',
    latitude: 34.0522,
    longitude: -118.2437,
    phone: '(555) 111-2222',
    acceptedMaterials: ['PET bottles', 'HDPE containers', 'aluminum cans', 'cardboard', 'electronics'],
    operatingHours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM'
  },
  {
    id: '2',
    name: 'Green Future Recycling',
    address: '5678 Future Ave, Pasadena, CA 91101',
    latitude: 34.1478,
    longitude: -118.1445,
    phone: '(555) 222-3333',
    acceptedMaterials: ['plastic bottles', 'glass containers', 'paper', 'cardboard', 'metal cans'],
    operatingHours: 'Mon-Sat: 7AM-7PM, Sun: 10AM-3PM'
  },
  {
    id: '3',
    name: 'CleanTech Recycling Hub',
    address: '9012 Tech Blvd, Burbank, CA 91502',
    latitude: 34.1808,
    longitude: -118.3090,
    phone: '(555) 333-4444',
    acceptedMaterials: ['electronics', 'batteries', 'plastic packaging', 'aluminum', 'steel'],
    operatingHours: 'Daily: 6AM-8PM'
  },
  {
    id: '4',
    name: 'Ocean Blue Recycling',
    address: '3456 Ocean Dr, Santa Monica, CA 90405',
    latitude: 34.0195,
    longitude: -118.4912,
    phone: '(555) 444-5555',
    acceptedMaterials: ['plastic bottles', 'fishing nets', 'ocean plastic', 'containers', 'packaging'],
    operatingHours: 'Mon-Fri: 9AM-5PM, Weekends: 10AM-2PM'
  },
  {
    id: '5',
    name: 'Sustainable Solutions Center',
    address: '7890 Sustain St, Glendale, CA 91201',
    latitude: 34.1425,
    longitude: -118.2551,
    phone: '(555) 555-6666',
    acceptedMaterials: ['all plastics', 'textiles', 'electronics', 'composites', 'mixed materials'],
    operatingHours: 'Mon-Sun: 24/7 (automated drop-off)'
  }
];

// Helper function to calculate distance between two points
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Helper function to get nearest locations
export const getNearestLocations = <T extends { latitude: number; longitude: number }>(
  userLat: number, 
  userLon: number, 
  locations: T[], 
  limit: number = 5
): (T & { distance: number })[] => {
  return locations
    .map(location => ({
      ...location,
      distance: calculateDistance(userLat, userLon, location.latitude, location.longitude)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};
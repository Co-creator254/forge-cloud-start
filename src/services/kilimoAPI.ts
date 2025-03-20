
import { KilimoStats } from '@/types';
import { simulateDelay } from './apiUtils';

// This simulates fetching data from the Kilimo API
export const fetchKilimoStats = async (): Promise<KilimoStats[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  // Log that we've processed the data
  console.info('Processed 85 Kilimo statistics');
  
  // Return simulated Kilimo statistics data
  return [
    // Agricultural production stats
    {
      id: 1,
      name: 'Maize Production',
      value: 3800000, // Convert string to number
      year: 2023,
      county: 'National',
      category: 'Production',
      unit: 'tonnes'
    },
    {
      id: 2,
      name: 'Coffee Production',
      value: 45000, // Convert string to number
      year: 2023,
      county: 'National',
      category: 'Production',
      unit: 'tonnes'
    },
    // Price statistics
    {
      id: 3,
      name: 'Average Maize Price',
      value: 4200, // Convert string to number
      year: 2023,
      county: 'National',
      category: 'Prices',
      unit: 'KES/90kg bag'
    },
    // Add more realistic data as needed...
    {
      id: 4,
      name: 'Nakuru',
      value: 235000,
      year: 2023,
      category: 'County'
    },
    {
      id: 5,
      name: 'Kiambu',
      value: 190000,
      year: 2023,
      category: 'County'
    },
    {
      id: 6,
      name: 'Meru',
      value: 210000,
      year: 2023,
      category: 'County'
    }
  ];
};

// This will be implemented with real API integration in the future
export const fetchKilimoMarkets = async () => {
  await simulateDelay(800);
  return [
    {
      id: 'MKT001',
      name: 'Wakulima Market',
      county: 'Nairobi',
      location: 'Nairobi CBD',
      producePrices: [
        { produceId: 'P001', produceName: 'Tomatoes', price: 3500, unit: 'crate', date: '2023-05-15' },
        { produceId: 'P002', produceName: 'Potatoes', price: 2200, unit: 'bag', date: '2023-05-15' },
        { produceId: 'P003', produceName: 'Maize', price: 4500, unit: 'bag', date: '2023-05-15' }
      ],
      demand: 'High',
      operatingHours: '5:00 AM - 7:00 PM'
    },
    {
      id: 'MKT002',
      name: 'Kongowea Market',
      county: 'Mombasa',
      location: 'Mombasa Island',
      producePrices: [
        { produceId: 'P001', produceName: 'Tomatoes', price: 3800, unit: 'crate', date: '2023-05-15' },
        { produceId: 'P002', produceName: 'Potatoes', price: 2500, unit: 'bag', date: '2023-05-15' },
        { produceId: 'P004', produceName: 'Mangoes', price: 1500, unit: 'crate', date: '2023-05-15' }
      ],
      demand: 'Medium',
      operatingHours: '6:00 AM - 6:00 PM'
    }
  ];
};

export const fetchKilimoFarmers = async () => {
  await simulateDelay(1000);
  return [
    {
      id: 'F001',
      name: 'John Kamau',
      county: 'Kiambu',
      contacts: '+254712345678',
      products: ['Maize', 'Beans', 'Potatoes'],
      farmSize: '5 acres',
      certifications: ['Organic']
    },
    {
      id: 'F002',
      name: 'Sarah Wanjiku',
      county: 'Nakuru',
      contacts: '+254723456789',
      products: ['Tomatoes', 'Onions', 'Kale'],
      farmSize: '3 acres',
    }
  ];
};

export const fetchKilimoProduce = async () => {
  await simulateDelay(900);
  return [
    {
      id: 'P001',
      name: 'Tomatoes',
      category: 'Vegetables',
      county: 'Kirinyaga',
      quantity: 500,
      unit: 'kg',
      qualityGrade: 'A',
      availableFrom: '2023-05-20',
      farmer: 'Mary Njeri',
      farmerId: 'F003'
    },
    {
      id: 'P002',
      name: 'Potatoes',
      category: 'Tubers',
      county: 'Nyandarua',
      quantity: 2000,
      unit: 'kg',
      qualityGrade: 'B',
      availableFrom: '2023-05-18',
      farmer: 'Peter Wachira',
      farmerId: 'F004'
    }
  ];
};

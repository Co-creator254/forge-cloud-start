import { Farmer, Produce, Market, Forecast } from '@/types';
import { simulateDelay } from './apiUtils';

// Farmers endpoint
export const fetchFarmers = async (county?: string): Promise<Farmer[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  const farmers: Farmer[] = [
    {
      id: "f1",
      name: "John Kamau",
      county: "Nakuru",
      contacts: "jkamau@example.com | +254712345678",
      products: ["Maize", "Beans", "Potatoes"],
      farmSize: "5 acres",
      certifications: ["Organic", "GlobalGAP"]
    },
    {
      id: "f2",
      name: "Mary Wanjiku",
      county: "Kiambu",
      contacts: "mwanjiku@example.com | +254723456789",
      products: ["Coffee", "Macadamia"],
      farmSize: "3 acres"
    },
    {
      id: "f3",
      name: "Peter Omondi",
      county: "Kisumu",
      contacts: "pomondi@example.com | +254734567890",
      products: ["Rice", "Vegetables"],
      farmSize: "4 acres",
      certifications: ["GlobalGAP"]
    },
    {
      id: "f4",
      name: "Sarah Muthoni",
      county: "Meru",
      contacts: "smuthoni@example.com | +254745678901",
      products: ["Tea", "Avocados"],
      farmSize: "6 acres"
    },
    {
      id: "f5",
      name: "James Mwangi",
      county: "Nakuru",
      contacts: "jmwangi@example.com | +254756789012",
      products: ["Wheat", "Dairy"],
      farmSize: "10 acres",
      certifications: ["Fairtrade"]
    }
  ];
  
  if (county) {
    return farmers.filter(farmer => 
      farmer.county.toLowerCase() === county.toLowerCase()
    );
  }
  
  return farmers;
};

// Produce endpoint
export const fetchProduce = async (county?: string): Promise<Produce[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  const produce: Produce[] = [
    {
      id: "p1",
      name: "Maize",
      category: "Cereals",
      county: "Nakuru",
      quantity: 500,
      unit: "kg",
      qualityGrade: "A",
      availableFrom: "2023-11-20",
      farmer: "John Kamau",
      farmerId: "f1"
    },
    {
      id: "p2",
      name: "Beans",
      category: "Legumes",
      county: "Nakuru",
      quantity: 200,
      unit: "kg",
      qualityGrade: "B",
      availableFrom: "2023-11-25",
      farmer: "John Kamau",
      farmerId: "f1"
    },
    {
      id: "p3",
      name: "Coffee",
      category: "Cash Crops",
      county: "Kiambu",
      quantity: 300,
      unit: "kg",
      qualityGrade: "AA",
      availableFrom: "2023-12-05",
      farmer: "Mary Wanjiku",
      farmerId: "f2"
    },
    {
      id: "p4",
      name: "Rice",
      category: "Cereals",
      county: "Kisumu",
      quantity: 600,
      unit: "kg",
      qualityGrade: "A",
      availableFrom: "2023-11-30",
      farmer: "Peter Omondi",
      farmerId: "f3"
    },
    {
      id: "p5",
      name: "Tea",
      category: "Cash Crops",
      county: "Meru",
      quantity: 250,
      unit: "kg",
      qualityGrade: "Premium",
      availableFrom: "2023-12-10",
      farmer: "Sarah Muthoni",
      farmerId: "f4"
    }
  ];
  
  if (county) {
    return produce.filter(item => 
      item.county.toLowerCase() === county.toLowerCase()
    );
  }
  
  return produce;
};

// Markets endpoint
export const fetchMarkets = async (county?: string): Promise<Market[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  const markets: Market[] = [
    {
      id: "m1",
      name: "Nakuru Central Market",
      county: "Nakuru",
      location: {
        county: "Nakuru",
        coordinates: {
          latitude: -0.3031,
          longitude: 36.0800
        }
      },
      producePrices: [
        {
          id: "p1",
          produceName: "Maize",
          price: 50,
          unit: "kg",
          date: "2023-11-15"
        },
        {
          id: "p2",
          produceName: "Beans",
          price: 120,
          unit: "kg",
          date: "2023-11-15"
        }
      ],
      demand: "High",
      operatingHours: "6am - 6pm, Monday to Saturday"
    },
    {
      id: "m2",
      name: "Kiambu Farmers Market",
      county: "Kiambu",
      location: {
        county: "Kiambu",
        coordinates: {
          latitude: -1.1700,
          longitude: 36.8300
        }
      },
      producePrices: [
        {
          id: "p3",
          produceName: "Coffee",
          price: 400,
          unit: "kg",
          date: "2023-11-14"
        }
      ],
      demand: "Medium",
      operatingHours: "7am - 5pm, Monday to Friday"
    },
    {
      id: "m3",
      name: "Kisumu Fish Market",
      county: "Kisumu",
      location: {
        county: "Kisumu",
        coordinates: {
          latitude: -0.1022,
          longitude: 34.7617
        }
      },
      producePrices: [
        {
          id: "p4",
          produceName: "Rice",
          price: 130,
          unit: "kg",
          date: "2023-11-16"
        }
      ],
      demand: "High",
      operatingHours: "5am - 7pm, Daily"
    },
    {
      id: "m4",
      name: "Meru County Market",
      county: "Meru",
      location: {
        county: "Meru",
        coordinates: {
          latitude: 0.0500,
          longitude: 37.6500
        }
      },
      producePrices: [
        {
          id: "p5",
          produceName: "Tea",
          price: 300,
          unit: "kg",
          date: "2023-11-13"
        }
      ],
      demand: "Medium",
      operatingHours: "6am - 6pm, Monday to Saturday"
    }
  ];
  
  if (county) {
    return markets.filter(market => 
      market.county.toLowerCase() === county.toLowerCase()
    );
  }
  
  return markets;
};

// Logistics endpoint
export const fetchLogistics = async (county?: string): Promise<LogisticsProvider[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  const logistics: LogisticsProvider[] = [
    {
      id: "l1",
      name: "Fast Track Transport",
      serviceType: "transport",
      counties: ["Nakuru", "Nairobi", "Kiambu"],
      contactInfo: "info@fasttrack.co.ke | +254712345678",
      capacity: "up to 10 tons",
      rates: "KES 5,000 - 15,000 depending on distance and load",
      hasRefrigeration: true
    },
    {
      id: "l2",
      name: "SafeStore Warehousing",
      serviceType: "storage",
      counties: ["Mombasa", "Kilifi"],
      contactInfo: "contact@safestore.co.ke | +254723456789",
      capacity: "5,000 sq. ft warehouse",
      rates: "KES 50 per sq. ft per month",
      hasRefrigeration: true
    },
    {
      id: "l3",
      name: "FarmLink Services",
      serviceType: "both",
      counties: ["Nakuru", "Nairobi", "Machakos", "Makueni"],
      contactInfo: "services@farmlink.co.ke | +254734567890",
      capacity: "up to 5 tons transport, 2,000 sq. ft storage",
      rates: "Transport: KES 4,000 - 12,000, Storage: KES 40 per sq. ft per month",
      hasRefrigeration: false
    },
    {
      id: "l4",
      name: "Cool Chain Ltd",
      serviceType: "both",
      counties: ["Nairobi", "Kiambu", "Kajiado"],
      contactInfo: "info@coolchain.co.ke | +254745678901",
      capacity: "up to 3 tons refrigerated transport, 1,000 sq. ft cold storage",
      rates: "Transport: KES 6,000 - 18,000, Storage: KES 70 per sq. ft per month",
      hasRefrigeration: true
    }
  ];
  
  if (county) {
    return logistics.filter(provider => 
      provider.counties.some(c => c.toLowerCase() === county.toLowerCase())
    );
  }
  
  return logistics;
};

// Forecasts endpoint
export const fetchForecasts = async (county?: string): Promise<Forecast[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  const forecasts: Forecast[] = [
    {
      id: "fc1",
      produceName: "Maize",
      county: "Nakuru",
      expectedProduction: 2500,
      expectedDemand: 2200,
      unit: "tons",
      period: "Dec 2023 - Feb 2024",
      confidenceLevel: "high"
    },
    {
      id: "fc2",
      produceName: "Coffee",
      county: "Kiambu",
      expectedProduction: 800,
      expectedDemand: 1000,
      unit: "tons",
      period: "Dec 2023 - Feb 2024",
      confidenceLevel: "medium"
    },
    {
      id: "fc3",
      produceName: "Rice",
      county: "Kisumu",
      expectedProduction: 1200,
      expectedDemand: 1400,
      unit: "tons",
      period: "Dec 2023 - Feb 2024",
      confidenceLevel: "medium"
    },
    {
      id: "fc4",
      produceName: "Tea",
      county: "Meru",
      expectedProduction: 1500,
      expectedDemand: 1300,
      unit: "tons",
      period: "Dec 2023 - Feb 2024",
      confidenceLevel: "high"
    },
    {
      id: "fc5",
      produceName: "Beans",
      county: "Nakuru",
      expectedProduction: 900,
      expectedDemand: 850,
      unit: "tons",
      period: "Dec 2023 - Feb 2024",
      confidenceLevel: "medium"
    }
  ];
  
  if (county) {
    return forecasts.filter(forecast => 
      forecast.county?.toLowerCase() === county.toLowerCase()
    );
  }
  
  return forecasts;
};


import { Transporter } from './types';

// Mock transport providers data until the API is implemented
export const mockTransporters: Transporter[] = [
  {
    id: "1",
    name: "Nairobi Express Logistics",
    serviceType: "transport",
    counties: ["Nairobi", "Kiambu", "Machakos"],
    contactInfo: "+254 712 345 678",
    capacity: "Large",
    loadCapacity: 5000,
    rates: "KES 25 per km",
    hasRefrigeration: true,
    vehicleType: "Refrigerated Truck",
  },
  {
    id: "2",
    name: "Mombasa Coastal Transporters",
    serviceType: "transport",
    counties: ["Mombasa", "Kilifi", "Kwale"],
    contactInfo: "+254 723 456 789",
    capacity: "Medium",
    loadCapacity: 3000,
    rates: "KES 20 per km",
    hasRefrigeration: false,
    vehicleType: "Flatbed Truck",
  },
  {
    id: "3",
    name: "Rift Valley Logistics",
    serviceType: "transport",
    counties: ["Nakuru", "Narok", "Kajiado"],
    contactInfo: "+254 734 567 890",
    capacity: "Large",
    loadCapacity: 6000,
    rates: "KES 22 per km",
    hasRefrigeration: true,
    vehicleType: "Refrigerated Truck",
  }
];

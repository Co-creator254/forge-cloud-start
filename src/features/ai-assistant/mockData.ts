
import { Transporter } from './types';

export const mockTransporters: Transporter[] = [
  {
    id: "TP001",
    name: "Nairobi Express Logistics",
    serviceType: "transport",
    counties: ["Nairobi", "Kiambu", "Machakos"],
    contactInfo: "+254712345678",
    capacity: "Up to 5 tons",
    loadCapacity: 5,
    rates: "KES 3000 per trip",
    hasRefrigeration: true,
    vehicleType: "Truck (3-5 tons)",
    availableTimes: ["Morning (5AM-11AM)", "Afternoon (11AM-4PM)"],
    latitude: -1.286389,
    longitude: 36.817223
  },
  {
    id: "TP002",
    name: "Mombasa Coastal Logistics",
    serviceType: "transport",
    counties: ["Mombasa", "Kilifi", "Kwale"],
    contactInfo: "+254723456789",
    capacity: "Up to 10 tons",
    loadCapacity: 10,
    rates: "KES 5000 per trip",
    hasRefrigeration: true,
    vehicleType: "Truck (5-10 tons)",
    availableTimes: ["Morning (5AM-11AM)", "Afternoon (11AM-4PM)", "Evening (4PM-9PM)"],
    latitude: -4.043740,
    longitude: 39.668201
  },
  {
    id: "TP003",
    name: "Kisumu Lake Transport",
    serviceType: "transport",
    counties: ["Kisumu", "Siaya", "Homa Bay"],
    contactInfo: "+254734567890",
    capacity: "Up to 3 tons",
    loadCapacity: 3,
    rates: "KES 2500 per trip",
    hasRefrigeration: false,
    vehicleType: "Pickup",
    availableTimes: ["Morning (5AM-11AM)", "Afternoon (11AM-4PM)"],
    latitude: -0.102222,
    longitude: 34.761944
  },
  {
    id: "TP004",
    name: "Nakuru Highland Movers",
    serviceType: "transport",
    counties: ["Nakuru", "Baringo", "Laikipia"],
    contactInfo: "+254745678901",
    capacity: "Up to 7 tons",
    loadCapacity: 7,
    rates: "KES 4000 per trip",
    hasRefrigeration: true,
    vehicleType: "Truck (5-10 tons)",
    availableTimes: ["Afternoon (11AM-4PM)", "Evening (4PM-9PM)"],
    latitude: -0.303099,
    longitude: 36.080025
  },
  {
    id: "TP005",
    name: "Mt. Kenya Distribution",
    serviceType: "transport",
    counties: ["Meru", "Nyeri", "Embu", "Tharaka-Nithi"],
    contactInfo: "+254756789012",
    capacity: "Up to 12 tons",
    loadCapacity: 12,
    rates: "KES 6000 per trip",
    hasRefrigeration: true,
    vehicleType: "Heavy Truck (10+ tons)",
    availableTimes: ["Morning (5AM-11AM)", "Evening (4PM-9PM)"],
    latitude: 0.046007,
    longitude: 37.649803
  }
];

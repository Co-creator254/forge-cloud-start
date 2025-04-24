import { ServiceProvider } from '@/types';

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: "sp1",
    name: "KenStore Warehousing Solutions",
    businessType: "storage",
    description: "Professional warehousing with climate control facilities for agricultural produce",
    services: ["Dry storage", "Cold storage", "Inventory management"],
    location: {
      county: "Nakuru",
      specificLocation: "Industrial Area, Nakuru Town",
      coordinates: {
        latitude: -0.303099,
        longitude: 36.080025
      }
    },
    contactInfo: "info@kenstore.co.ke | +254712345678",
    website: "http://www.kenstore.co.ke",
    verified: true,
    rating: 4.8,
    reviewCount: 42,
    tags: ["certified", "climate-controlled", "secure"],
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-04-10T14:20:00Z"
  },
  {
    id: "sp2",
    name: "AgriLogistics Transport",
    businessType: "transport",
    description: "Specialized agricultural produce transport with refrigerated trucks",
    services: ["Refrigerated transport", "Cross-county delivery", "Last-mile delivery"],
    location: {
      county: "Nairobi",
      specificLocation: "Karen",
    },
    contactInfo: "operations@agrilogistics.co.ke | +254723456789",
    verified: true,
    rating: 4.5,
    reviewCount: 37,
    tags: ["timely", "refrigerated", "nationwide"],
    createdAt: "2024-02-05T10:15:00Z",
    updatedAt: "2024-04-12T09:45:00Z"
  },
  {
    id: "sp3",
    name: "FarmQuality Inspectors",
    businessType: "quality-control",
    description: "Independent quality inspection services for agricultural produce and facilities",
    services: ["Produce quality certification", "Farm audits", "Export standard verification"],
    location: {
      county: "Kiambu",
      specificLocation: "Thika Road",
    },
    contactInfo: "inspections@farmquality.co.ke | +254734567890",
    website: "http://www.farmquality.co.ke",
    verified: true,
    rating: 4.7,
    reviewCount: 29,
    tags: ["certified", "export-standards", "GlobalGAP"],
    createdAt: "2023-11-20T11:00:00Z",
    updatedAt: "2024-04-08T16:30:00Z"
  },
  {
    id: "sp4",
    name: "AgriTrain Kenya",
    businessType: "training",
    description: "Specialized agricultural training and capacity building for farmers",
    services: ["Crop management training", "Post-harvest handling", "Certification preparation"],
    location: {
      county: "Meru",
      specificLocation: "Meru Town",
    },
    contactInfo: "training@agritrain.co.ke | +254745678901",
    verified: false,
    rating: 4.3,
    reviewCount: 18,
    tags: ["hands-on", "certificate-courses", "field-demonstrations"],
    createdAt: "2024-03-10T09:00:00Z",
    updatedAt: "2024-04-15T11:20:00Z"
  },
  {
    id: "sp5",
    name: "FarmInputs Plus",
    businessType: "input-supplier",
    description: "Quality agricultural inputs including certified seeds, fertilizers and crop protection products",
    services: ["Certified seeds", "Organic fertilizers", "Crop protection", "Soil testing"],
    location: {
      county: "Nakuru",
      specificLocation: "Nakuru-Eldoret Highway",
      coordinates: {
        latitude: -0.286654,
        longitude: 36.063319
      }
    },
    contactInfo: "sales@farminputs.co.ke | +254756789012",
    website: "http://www.farminputs.co.ke",
    verified: true,
    rating: 4.6,
    reviewCount: 52,
    tags: ["certified-products", "technical-support", "delivery"],
    createdAt: "2023-09-15T14:30:00Z",
    updatedAt: "2024-04-14T10:45:00Z"
  }
];

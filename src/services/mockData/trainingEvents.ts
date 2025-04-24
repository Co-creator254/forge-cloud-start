import { TrainingEvent } from '@/types';

export const mockTrainingEvents: TrainingEvent[] = [
  {
    id: "te1",
    title: "Advanced Potato Farming Techniques",
    description: "Learn advanced techniques for potato cultivation including disease management and optimal fertilization",
    providerId: "sp4",
    providerName: "AgriTrain Kenya",
    date: "2025-05-15T09:00:00Z",
    location: "Meru Agricultural Training Center",
    topics: ["Disease management", "Fertilization", "Storage techniques"],
    capacity: 30,
    registeredCount: 18,
    cost: "KSh 2,500"
  },
  {
    id: "te2",
    title: "Post-Harvest Handling for Horticulture",
    description: "Comprehensive training on proper post-harvest handling of various horticultural produce",
    providerId: "sp3",
    providerName: "FarmQuality Inspectors",
    date: "2025-05-22T10:00:00Z",
    location: "Thika Agricultural Showground",
    topics: ["Cold chain management", "Packaging", "Quality standards"],
    capacity: 25,
    registeredCount: 22,
    cost: "KSh 3,000"
  },
  {
    id: "te3",
    title: "GlobalGAP Certification Workshop",
    description: "Step-by-step guidance on achieving GlobalGAP certification for export markets",
    providerId: "sp3",
    providerName: "FarmQuality Inspectors",
    date: "2025-06-10T08:30:00Z",
    location: "Kiambu Agricultural Training Center",
    topics: ["Certification requirements", "Documentation", "Audit preparation"],
    capacity: 20,
    registeredCount: 12,
    cost: "KSh 5,000"
  }
];

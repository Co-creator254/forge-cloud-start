
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Transporter {
  id: string;
  name: string;
  serviceType: string;
  counties: string[];
  contactInfo: string;
  capacity: string;
  loadCapacity: number;
  rates: string;
  hasRefrigeration: boolean;
  vehicleType: string;
  availableTimes?: string[];
  latitude?: number;
  longitude?: number;
}

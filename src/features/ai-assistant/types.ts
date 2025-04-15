
import { Market, Forecast, Warehouse } from '@/types';

export interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
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
}

export interface TransporterProfile {
  id: string;
  userId: string;
  name: string;
  serviceType: string;
  counties: string[];
  contactInfo: string;
  capacity: string;
  loadCapacity: number;
  rates: string;
  hasRefrigeration: boolean;
  vehicleType: string;
  createdAt: Date;
  updatedAt: Date;
}

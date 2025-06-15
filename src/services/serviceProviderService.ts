
import { supabase } from '@/integrations/supabase/client';
import { ServiceProvider } from '@/types';

export interface ServiceProviderFormData {
  businessName: string;
  serviceType: string;
  description: string;
  location: string;
  contactPhone?: string;
  contactEmail: string;
  websiteUrl?: string;
  countiesServed: string[];
  servicesOffered: string[];
  certifications: string[];
  experienceYears: number;
  hourlyRate?: number;
}

export const createServiceProvider = async (data: ServiceProviderFormData) => {
  const { data: result, error } = await supabase
    .from('service_providers')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      business_name: data.businessName,
      service_type: data.serviceType,
      description: data.description,
      location: data.location,
      contact_phone: data.contactPhone,
      contact_email: data.contactEmail,
      website_url: data.websiteUrl,
      counties_served: data.countiesServed,
      services_offered: data.servicesOffered,
      certifications: data.certifications,
      experience_years: data.experienceYears,
      hourly_rate: data.hourlyRate,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getServiceProviders = async (filters?: { 
  serviceType?: string; 
  county?: string; 
  searchTerm?: string; 
}) => {
  let query = supabase
    .from('service_providers')
    .select('*')
    .eq('is_active', true);

  if (filters?.serviceType) {
    query = query.eq('service_type', filters.serviceType);
  }

  if (filters?.county) {
    query = query.contains('counties_served', [filters.county]);
  }

  if (filters?.searchTerm) {
    query = query.or(`business_name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateServiceProvider = async (id: string, updates: Partial<ServiceProviderFormData>) => {
  const { data, error } = await supabase
    .from('service_providers')
    .update({
      business_name: updates.businessName,
      service_type: updates.serviceType,
      description: updates.description,
      location: updates.location,
      contact_phone: updates.contactPhone,
      contact_email: updates.contactEmail,
      website_url: updates.websiteUrl,
      counties_served: updates.countiesServed,
      services_offered: updates.servicesOffered,
      certifications: updates.certifications,
      experience_years: updates.experienceYears,
      hourly_rate: updates.hourlyRate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

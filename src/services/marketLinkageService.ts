
import { supabase } from '@/integrations/supabase/client';

export interface MarketLinkageFormData {
  title: string;
  description: string;
  linkageType: 'buyer_seller' | 'contract_farming' | 'cooperative' | 'export_opportunity' | 'processing_partnership';
  cropsInvolved: string[];
  counties: string[];
  requirements: string[];
  benefits: string[];
  contactInfo: string;
  applicationDeadline?: string;
  startDate?: string;
  durationMonths?: number;
  minimumQuantity?: number;
  priceRange?: string;
  maxParticipants?: number;
}

export const createMarketLinkage = async (data: MarketLinkageFormData) => {
  const { data: result, error } = await supabase
    .from('market_linkages')
    .insert({
      created_by: (await supabase.auth.getUser()).data.user?.id,
      title: data.title,
      description: data.description,
      linkage_type: data.linkageType,
      crops_involved: data.cropsInvolved,
      counties: data.counties,
      requirements: data.requirements,
      benefits: data.benefits,
      contact_info: data.contactInfo,
      application_deadline: data.applicationDeadline,
      start_date: data.startDate,
      duration_months: data.durationMonths,
      minimum_quantity: data.minimumQuantity,
      price_range: data.priceRange,
      max_participants: data.maxParticipants,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getMarketLinkages = async (filters?: {
  linkageType?: string;
  county?: string;
  crop?: string;
  activeOnly?: boolean;
}) => {
  let query = supabase
    .from('market_linkages')
    .select(`
      *,
      profiles:created_by (
        full_name,
        contact_number
      )
    `);

  if (filters?.linkageType) {
    query = query.eq('linkage_type', filters.linkageType);
  }

  if (filters?.county) {
    query = query.contains('counties', [filters.county]);
  }

  if (filters?.crop) {
    query = query.contains('crops_involved', [filters.crop]);
  }

  if (filters?.activeOnly !== false) {
    query = query.eq('status', 'active');
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const applyToMarketLinkage = async (linkageId: string) => {
  // This would typically involve creating an application record
  // For now, we'll just increment the participant count
  const { data, error } = await supabase.rpc('increment_linkage_participants', {
    linkage_id: linkageId
  });

  if (error) throw error;
  return data;
};

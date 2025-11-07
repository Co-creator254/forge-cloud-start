import { supabase } from '@/integrations/supabase/client';

export interface ContractFarmingOpportunity {
  id: string;
  contractor_id: string;
  contractor_name: string;
  contractor_type: string;
  crop_type: string;
  variety?: string;
  required_quantity: number;
  contract_price: number;
  unit: string;
  currency: string;
  location: string;
  county: string;
  planting_season: string;
  harvest_period: string;
  contract_duration: string;
  requirements: string;
  benefits_offered: string;
  support_provided?: string[];
  payment_terms: string;
  quality_standards: string;
  delivery_terms: string;
  contact_phone: string;
  contact_email?: string;
  application_deadline: string;
  max_farmers?: number;
  current_applications: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SuccessStory {
  id: string;
  author_id: string;
  title: string;
  story: string;
  category?: string;
  featured_image_url?: string;
  impact_metrics?: any;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export const marketplaceService = {
  // Contract Farming
  async getContractOpportunities(status = 'open') {
    const { data, error } = await supabase
      .from('contract_farming')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ContractFarmingOpportunity[];
  },

  async getContractOpportunityById(id: string) {
    const { data, error } = await supabase
      .from('contract_farming')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ContractFarmingOpportunity;
  },

  async createContractOpportunity(opportunity: Omit<ContractFarmingOpportunity, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('contract_farming')
      .insert(opportunity)
      .select()
      .single();

    if (error) throw error;
    return data as ContractFarmingOpportunity;
  },

  async updateContractOpportunity(id: string, updates: Partial<ContractFarmingOpportunity>) {
    const { data, error } = await supabase
      .from('contract_farming')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ContractFarmingOpportunity;
  },

  // Success Stories
  async getSuccessStories(published = true) {
    let query = supabase
      .from('success_stories')
      .select('*');

    if (published) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as SuccessStory[];
  },

  async getFeaturedSuccessStories() {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SuccessStory[];
  },

  async getSuccessStoryById(id: string) {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as SuccessStory;
  },

  async createSuccessStory(story: Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('success_stories')
      .insert(story)
      .select()
      .single();

    if (error) throw error;
    return data as SuccessStory;
  },

  async updateSuccessStory(id: string, updates: Partial<SuccessStory>) {
    const { data, error } = await supabase
      .from('success_stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SuccessStory;
  },
};

import { supabase } from '@/integrations/supabase/client';

export interface SupplyChainStage {
  id: string;
  user_id: string;
  farm_id?: string;
  crop_id?: string;
  stage_name: 'planting' | 'growth' | 'harvest' | 'storage' | 'transport' | 'market';
  status: 'active' | 'completed' | 'delayed' | 'problem';
  progress: number;
  start_date?: string;
  end_date?: string;
  issues?: any[];
  data?: any;
  created_at: string;
  updated_at: string;
}

export interface FinancialAnalysis {
  id: string;
  user_id: string;
  stage_id?: string;
  cost_type: string;
  amount: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const supplyChainService = {
  // Get all supply chain stages for a user
  async getStages(userId: string) {
    const { data, error } = await supabase
      .from('supply_chain_stages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SupplyChainStage[];
  },

  // Get stage by ID
  async getStageById(id: string) {
    const { data, error } = await supabase
      .from('supply_chain_stages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as SupplyChainStage;
  },

  // Create new supply chain stage
  async createStage(stage: Omit<SupplyChainStage, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('supply_chain_stages')
      .insert(stage)
      .select()
      .single();

    if (error) throw error;
    return data as SupplyChainStage;
  },

  // Update supply chain stage
  async updateStage(id: string, updates: Partial<SupplyChainStage>) {
    const { data, error } = await supabase
      .from('supply_chain_stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SupplyChainStage;
  },

  // Delete supply chain stage
  async deleteStage(id: string) {
    const { error } = await supabase
      .from('supply_chain_stages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get financial analysis for stages
  async getFinancialAnalysis(userId: string, stageId?: string) {
    let query = supabase
      .from('supply_chain_financial_analysis')
      .select('*')
      .eq('user_id', userId);

    if (stageId) {
      query = query.eq('stage_id', stageId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as FinancialAnalysis[];
  },

  // Create financial analysis entry
  async createFinancialAnalysis(analysis: Omit<FinancialAnalysis, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('supply_chain_financial_analysis')
      .insert(analysis)
      .select()
      .single();

    if (error) throw error;
    return data as FinancialAnalysis;
  },

  // Get financial summary by cost type
  async getFinancialSummary(userId: string) {
    const { data, error } = await supabase
      .from('supply_chain_financial_analysis')
      .select('cost_type, amount, currency')
      .eq('user_id', userId);

    if (error) throw error;

    // Aggregate by cost type
    const summary = data.reduce((acc: any, item: any) => {
      if (!acc[item.cost_type]) {
        acc[item.cost_type] = 0;
      }
      acc[item.cost_type] += parseFloat(item.amount);
      return acc;
    }, {});

    return summary;
  },
};

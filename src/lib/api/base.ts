import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

// Generic CRUD operations
export class ApiBase<T extends TableName> {
  protected tableName: T;

  constructor(tableName: T) {
    this.tableName = tableName;
  }

  async getAll(filters?: Partial<Tables[T]['Row']>) {
    let query = supabase.from(this.tableName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(data: Tables[T]['Insert']) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async update(id: string, data: Tables[T]['Update']) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Utility functions
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage || 'API operation failed:', error);
    throw error;
  }
};
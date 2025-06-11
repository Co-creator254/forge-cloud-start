
import { supabase } from '@/integrations/supabase/client';

export interface FarmTask {
  id: string;
  title: string;
  crop: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed';
  description: string;
  user_id: string;
}

export interface WeatherAlert {
  id: string;
  type: 'Cyclone' | 'Rain' | 'Drought';
  region: string;
  severity: 'critical' | 'moderate' | 'low';
  description: string;
  startDate: string;
  endDate: string;
}

export interface FarmStats {
  monthlyRevenue: number;
  totalArea: number;
  averageYield: number;
  activeAlerts: number;
}

export class FarmerService {
  static async getFarmTasks(userId: string): Promise<FarmTask[]> {
    try {
      const { data, error } = await supabase
        .from('farm_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching farm tasks:', error);
      return [];
    }
  }

  static async createFarmTask(task: Omit<FarmTask, 'id'>): Promise<FarmTask | null> {
    try {
      const { data, error } = await supabase
        .from('farm_tasks')
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating farm task:', error);
      return null;
    }
  }

  static async updateFarmTask(id: string, updates: Partial<FarmTask>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('farm_tasks')
        .update(updates)
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating farm task:', error);
      return false;
    }
  }

  static async deleteFarmTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('farm_tasks')
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error deleting farm task:', error);
      return false;
    }
  }

  static async getFarmStats(userId: string): Promise<FarmStats> {
    try {
      // Get farm statistics from database
      const { data: farmData, error } = await supabase
        .from('farm_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Return default stats if no data found
        return {
          monthlyRevenue: 0,
          totalArea: 0,
          averageYield: 0,
          activeAlerts: 0
        };
      }

      return farmData;
    } catch (error) {
      console.error('Error fetching farm stats:', error);
      return {
        monthlyRevenue: 0,
        totalArea: 0,
        averageYield: 0,
        activeAlerts: 0
      };
    }
  }

  static async getWeatherAlerts(region: string): Promise<WeatherAlert[]> {
    try {
      const { data, error } = await supabase
        .from('weather_alerts')
        .select('*')
        .eq('region', region)
        .eq('is_active', true)
        .order('severity', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }
}

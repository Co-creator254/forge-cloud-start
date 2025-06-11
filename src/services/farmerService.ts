
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
  start_date: string;
  end_date: string;
}

export interface FarmStats {
  monthly_revenue: number;
  total_area: number;
  average_yield: number;
  active_alerts: number;
}

export class FarmerService {
  static async getFarmTasks(userId: string): Promise<FarmTask[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_farm_tasks', { p_user_id: userId });

      if (error) {
        console.error('Error fetching farm tasks:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching farm tasks:', error);
      return [];
    }
  }

  static async createFarmTask(task: Omit<FarmTask, 'id'>): Promise<FarmTask | null> {
    try {
      const { data, error } = await supabase
        .rpc('create_farm_task', {
          p_user_id: task.user_id,
          p_title: task.title,
          p_description: task.description,
          p_crop: task.crop,
          p_date: task.date,
          p_priority: task.priority,
          p_status: task.status
        });

      if (error) {
        console.error('Error creating farm task:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error creating farm task:', error);
      return null;
    }
  }

  static async updateFarmTask(id: string, updates: Partial<FarmTask>): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('update_farm_task', {
          p_task_id: id,
          p_updates: updates
        });

      return !error;
    } catch (error) {
      console.error('Error updating farm task:', error);
      return false;
    }
  }

  static async deleteFarmTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('delete_farm_task', { p_task_id: id });

      return !error;
    } catch (error) {
      console.error('Error deleting farm task:', error);
      return false;
    }
  }

  static async getFarmStats(userId: string): Promise<FarmStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_farm_stats', { p_user_id: userId });

      if (error) {
        console.error('Error fetching farm stats:', error);
        return {
          monthly_revenue: 0,
          total_area: 0,
          average_yield: 0,
          active_alerts: 0
        };
      }

      return data || {
        monthly_revenue: 0,
        total_area: 0,
        average_yield: 0,
        active_alerts: 0
      };
    } catch (error) {
      console.error('Error fetching farm stats:', error);
      return {
        monthly_revenue: 0,
        total_area: 0,
        average_yield: 0,
        active_alerts: 0
      };
    }
  }

  static async getWeatherAlerts(region: string): Promise<WeatherAlert[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_weather_alerts', { p_region: region });

      if (error) {
        console.error('Error fetching weather alerts:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }
}

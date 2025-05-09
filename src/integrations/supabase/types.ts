export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      market_forecasts: {
        Row: {
          commodity_name: string
          confidence_level: number
          county: string
          created_at: string
          current_price: number
          factors: Json | null
          forecast_price: number
          id: string
          period: string
          valid_until: string
        }
        Insert: {
          commodity_name: string
          confidence_level?: number
          county: string
          created_at?: string
          current_price: number
          factors?: Json | null
          forecast_price: number
          id?: string
          period?: string
          valid_until?: string
        }
        Update: {
          commodity_name?: string
          confidence_level?: number
          county?: string
          created_at?: string
          current_price?: number
          factors?: Json | null
          forecast_price?: number
          id?: string
          period?: string
          valid_until?: string
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          commodity_name: string
          confidence_score: number | null
          county: string
          date_recorded: string
          id: string
          market_id: string
          market_name: string
          price: number
          source: string
          unit: string
          verified: boolean | null
        }
        Insert: {
          commodity_name: string
          confidence_score?: number | null
          county: string
          date_recorded?: string
          id?: string
          market_id: string
          market_name: string
          price: number
          source?: string
          unit: string
          verified?: boolean | null
        }
        Update: {
          commodity_name?: string
          confidence_score?: number | null
          county?: string
          date_recorded?: string
          id?: string
          market_id?: string
          market_name?: string
          price?: number
          source?: string
          unit?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      market_sentiment: {
        Row: {
          commodity_name: string
          county: string
          created_at: string
          id: string
          issues: string[]
          report_count: number
          sentiment_score: number
          tags: string[]
          updated_at: string
        }
        Insert: {
          commodity_name: string
          county: string
          created_at?: string
          id?: string
          issues?: string[]
          report_count?: number
          sentiment_score: number
          tags?: string[]
          updated_at?: string
        }
        Update: {
          commodity_name?: string
          county?: string
          created_at?: string
          id?: string
          issues?: string[]
          report_count?: number
          sentiment_score?: number
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          media_type: string | null
          media_url: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          media_type?: string | null
          media_url?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          media_type?: string | null
          media_url?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          contact_number: string | null
          county: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transporters: {
        Row: {
          capacity: string
          contact_info: string
          counties: string[]
          created_at: string
          has_refrigeration: boolean
          id: string
          load_capacity: number
          name: string
          rates: string
          service_type: string
          updated_at: string
          user_id: string
          vehicle_type: string
        }
        Insert: {
          capacity: string
          contact_info: string
          counties: string[]
          created_at?: string
          has_refrigeration?: boolean
          id?: string
          load_capacity: number
          name: string
          rates: string
          service_type: string
          updated_at?: string
          user_id: string
          vehicle_type: string
        }
        Update: {
          capacity?: string
          contact_info?: string
          counties?: string[]
          created_at?: string
          has_refrigeration?: boolean
          id?: string
          load_capacity?: number
          name?: string
          rates?: string
          service_type?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

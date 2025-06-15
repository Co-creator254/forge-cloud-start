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
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_preview: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_preview: string
          last_used_at?: string | null
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_preview?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number | null
          status_code: number
          user_agent: string | null
          user_id: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code: number
          user_agent?: string | null
          user_id: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code?: number
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      business_advertisements: {
        Row: {
          ad_content: string
          amount_paid: number | null
          business_category: string
          business_description: string
          business_name: string
          clicks_count: number | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          expires_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          payment_id: string | null
          payment_status: string | null
          target_audience: string[] | null
          updated_at: string
          user_id: string | null
          views_count: number | null
          website_url: string | null
        }
        Insert: {
          ad_content: string
          amount_paid?: number | null
          business_category: string
          business_description: string
          business_name: string
          clicks_count?: number | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          payment_id?: string | null
          payment_status?: string | null
          target_audience?: string[] | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
          website_url?: string | null
        }
        Update: {
          ad_content?: string
          amount_paid?: number | null
          business_category?: string
          business_description?: string
          business_name?: string
          clicks_count?: number | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          payment_id?: string | null
          payment_status?: string | null
          target_audience?: string[] | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      community_polls: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          post_id: string | null
          question: string
          total_votes: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          post_id?: string | null
          question: string
          total_votes?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          post_id?: string | null
          question?: string
          total_votes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          location: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_fetch_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          records_count: number | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          records_count?: number | null
          source: string
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          records_count?: number | null
          source?: string
          status?: string
        }
        Relationships: []
      }
      farm_statistics: {
        Row: {
          active_alerts: number | null
          average_yield: number | null
          created_at: string
          id: string
          monthly_revenue: number | null
          total_area: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_tasks: {
        Row: {
          created_at: string
          crop: string
          date: string
          description: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop: string
          date: string
          description?: string | null
          id?: string
          priority: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop?: string
          date?: string
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kilimo_statistics: {
        Row: {
          category: string
          county: string
          created_at: string | null
          external_id: string | null
          fetch_date: string | null
          id: string
          metadata: Json | null
          name: string
          source: string | null
          unit: string | null
          updated_at: string | null
          value: string
          verified: boolean | null
        }
        Insert: {
          category: string
          county: string
          created_at?: string | null
          external_id?: string | null
          fetch_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          source?: string | null
          unit?: string | null
          updated_at?: string | null
          value: string
          verified?: boolean | null
        }
        Update: {
          category?: string
          county?: string
          created_at?: string | null
          external_id?: string | null
          fetch_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          source?: string | null
          unit?: string | null
          updated_at?: string | null
          value?: string
          verified?: boolean | null
        }
        Relationships: []
      }
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
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          advertisement_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          payment_details: Json | null
          payment_provider: string
          status: string | null
          transaction_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_provider: string
          status?: string | null
          transaction_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_provider?: string
          status?: string | null
          transaction_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "business_advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "community_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          parent_id: string | null
          post_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_tiers: {
        Row: {
          created_at: string
          currency: string
          features: string[]
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          period: string
          price: number
          requests: number
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: string[]
          id: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          period: string
          price: number
          requests: number
        }
        Update: {
          created_at?: string
          currency?: string
          features?: string[]
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          period?: string
          price?: number
          requests?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          contact_number: string | null
          county: string | null
          created_at: string
          email: string | null
          experience_years: number | null
          farm_size: number | null
          farm_type: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          role: string | null
          specialization: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
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
      weather_alerts: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          region: string
          severity: string
          start_date: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          region: string
          severity: string
          start_date: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          region?: string
          severity?: string
          start_date?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_user_id: string
          p_subscription_type: string
          p_time_window?: unknown
        }
        Returns: Json
      }
      validate_api_key: {
        Args: { p_key_hash: string }
        Returns: Json
      }
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

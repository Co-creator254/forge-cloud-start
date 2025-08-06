export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      barter_listings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string
          offering_product_id: string
          offering_quantity: number
          seeking_product_id: string
          seeking_quantity: number
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location: string
          offering_product_id: string
          offering_quantity: number
          seeking_product_id: string
          seeking_quantity: number
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          offering_product_id?: string
          offering_quantity?: number
          seeking_product_id?: string
          seeking_quantity?: number
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "barter_listings_offering_product_id_fkey"
            columns: ["offering_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barter_listings_seeking_product_id_fkey"
            columns: ["seeking_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barter_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          downvotes: number | null
          id: string
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          downvotes: number | null
          id: string
          images: string[] | null
          is_pinned: boolean | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          images?: string[] | null
          is_pinned?: boolean | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          images?: string[] | null
          is_pinned?: boolean | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      farms: {
        Row: {
          certifications: string[] | null
          coordinates: Json | null
          created_at: string
          farm_name: string
          farm_type: string | null
          farmer_id: string
          id: string
          location: string
          size_hectares: number | null
          updated_at: string
        }
        Insert: {
          certifications?: string[] | null
          coordinates?: Json | null
          created_at?: string
          farm_name: string
          farm_type?: string | null
          farmer_id: string
          id?: string
          location: string
          size_hectares?: number | null
          updated_at?: string
        }
        Update: {
          certifications?: string[] | null
          coordinates?: Json | null
          created_at?: string
          farm_name?: string
          farm_type?: string | null
          farmer_id?: string
          id?: string
          location?: string
          size_hectares?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farms_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      food_rescue_listings: {
        Row: {
          available_from: string | null
          available_until: string
          condition_description: string | null
          created_at: string
          donor_id: string
          expiry_date: string | null
          id: string
          pickup_location: string
          product_id: string
          quantity: number
          status: string | null
          updated_at: string
        }
        Insert: {
          available_from?: string | null
          available_until: string
          condition_description?: string | null
          created_at?: string
          donor_id: string
          expiry_date?: string | null
          id?: string
          pickup_location: string
          product_id: string
          quantity: number
          status?: string | null
          updated_at?: string
        }
        Update: {
          available_from?: string | null
          available_until?: string
          condition_description?: string | null
          created_at?: string
          donor_id?: string
          expiry_date?: string | null
          id?: string
          pickup_location?: string
          product_id?: string
          quantity?: number
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_rescue_listings_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "food_rescue_listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      group_input_orders: {
        Row: {
          created_at: string
          current_quantity: number | null
          deadline: string
          description: string | null
          id: string
          input_name: string
          location: string
          organizer_id: string
          status: string | null
          supplier_id: string | null
          target_quantity: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_quantity?: number | null
          deadline: string
          description?: string | null
          id?: string
          input_name: string
          location: string
          organizer_id: string
          status?: string | null
          supplier_id?: string | null
          target_quantity: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_quantity?: number | null
          deadline?: string
          description?: string | null
          id?: string
          input_name?: string
          location?: string
          organizer_id?: string
          status?: string | null
          supplier_id?: string | null
          target_quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_input_orders_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "group_input_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_order_participants: {
        Row: {
          id: string
          joined_at: string
          order_id: string
          participant_id: string
          quantity: number
        }
        Insert: {
          id?: string
          joined_at?: string
          order_id: string
          participant_id: string
          quantity: number
        }
        Update: {
          id?: string
          joined_at?: string
          order_id?: string
          participant_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_order_participants_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "group_input_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_order_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          available_from: string | null
          available_until: string | null
          created_at: string
          description: string | null
          harvest_date: string | null
          id: string
          images: string[] | null
          location: string
          product_id: string
          quality_grade: string | null
          quantity: number
          seller_id: string
          status: string | null
          title: string
          total_price: number | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location: string
          product_id: string
          quality_grade?: string | null
          quantity: number
          seller_id: string
          status?: string | null
          title: string
          total_price?: number | null
          unit_price: number
          updated_at?: string
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string
          product_id?: string
          quality_grade?: string | null
          quantity?: number
          seller_id?: string
          status?: string | null
          title?: string
          total_price?: number | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      my_trades: {
        Row: {
          buyer_id: string
          created_at: string
          delivery_date: string | null
          delivery_location: string | null
          id: string
          listing_id: string | null
          payment_method: string | null
          product_id: string
          quantity: number
          seller_id: string
          status: string | null
          total_amount: number
          trade_type: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          delivery_date?: string | null
          delivery_location?: string | null
          id?: string
          listing_id?: string | null
          payment_method?: string | null
          product_id: string
          quantity: number
          seller_id: string
          status?: string | null
          total_amount: number
          trade_type?: string | null
          unit_price: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          delivery_date?: string | null
          delivery_location?: string | null
          id?: string
          listing_id?: string | null
          payment_method?: string | null
          product_id?: string
          quantity?: number
          seller_id?: string
          status?: string | null
          total_amount?: number
          trade_type?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_trades_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "my_trades_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "my_trades_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "my_trades_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read_at: string | null
          related_id: string | null
          related_table: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          related_id?: string | null
          related_table?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          related_id?: string | null
          related_table?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      price_trends: {
        Row: {
          created_at: string
          id: string
          location: string
          market_type: string | null
          price: number
          product_id: string
          recorded_date: string
          source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          market_type?: string | null
          price: number
          product_id: string
          recorded_date?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          market_type?: string | null
          price?: number
          product_id?: string
          recorded_date?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_trends_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          seasonal_availability: string[] | null
          shelf_life_days: number | null
          subcategory: string | null
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          seasonal_availability?: string[] | null
          shelf_life_days?: number | null
          subcategory?: string | null
          unit_of_measure: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          seasonal_availability?: string[] | null
          shelf_life_days?: number | null
          subcategory?: string | null
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone_number: string | null
          profile_image_url: string | null
          updated_at: string
          user_id: string
          user_type: string | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id: string
          user_type?: string | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          business_name: string
          certification_documents: string[] | null
          coverage_areas: string[] | null
          created_at: string
          id: string
          pricing_structure: Json | null
          rating: number | null
          service_category: string
          services_offered: string[] | null
          total_reviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name: string
          certification_documents?: string[] | null
          coverage_areas?: string[] | null
          created_at?: string
          id?: string
          pricing_structure?: Json | null
          rating?: number | null
          service_category: string
          services_offered?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          certification_documents?: string[] | null
          coverage_areas?: string[] | null
          created_at?: string
          id?: string
          pricing_structure?: Json | null
          rating?: number | null
          service_category?: string
          services_offered?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      training_events: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          end_date: string
          event_type: string | null
          fee: number | null
          id: string
          location: string | null
          materials_provided: string[] | null
          max_participants: number | null
          organizer_id: string
          requirements: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date: string
          event_type?: string | null
          fee?: number | null
          id?: string
          location?: string | null
          materials_provided?: string[] | null
          max_participants?: number | null
          organizer_id: string
          requirements?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string
          event_type?: string | null
          fee?: number | null
          id?: string
          location?: string | null
          materials_provided?: string[] | null
          max_participants?: number | null
          organizer_id?: string
          requirements?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transportation_requests: {
        Row: {
          budget: number | null
          cargo_details: string
          cargo_weight: number | null
          created_at: string
          delivery_location: string
          id: string
          pickup_location: string
          preferred_date: string | null
          requester_id: string
          status: string | null
          transporter_id: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          cargo_details: string
          cargo_weight?: number | null
          created_at?: string
          delivery_location: string
          id?: string
          pickup_location: string
          preferred_date?: string | null
          requester_id: string
          status?: string | null
          transporter_id?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          cargo_details?: string
          cargo_weight?: number | null
          created_at?: string
          delivery_location?: string
          id?: string
          pickup_location?: string
          preferred_date?: string | null
          requester_id?: string
          status?: string | null
          transporter_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transportation_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transportation_requests_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

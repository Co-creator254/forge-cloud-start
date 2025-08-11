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
      animals: {
        Row: {
          acquisition_date: string | null
          birth_date: string | null
          breed: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          species: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          acquisition_date?: string | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          species: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          acquisition_date?: string | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          species?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          currency_preference: string | null
          data_sync_enabled: boolean | null
          id: string
          language_preference: string | null
          location_sharing: boolean | null
          marketing_communications: boolean | null
          notification_preferences: Json | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency_preference?: string | null
          data_sync_enabled?: boolean | null
          id?: string
          language_preference?: string | null
          location_sharing?: boolean | null
          marketing_communications?: boolean | null
          notification_preferences?: Json | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency_preference?: string | null
          data_sync_enabled?: boolean | null
          id?: string
          language_preference?: string | null
          location_sharing?: boolean | null
          marketing_communications?: boolean | null
          notification_preferences?: Json | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      barter_listings: {
        Row: {
          commodity: string | null
          county: string | null
          created_at: string
          description: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean
          location: string
          offering_product_id: string
          offering_quantity: number
          seeking_commodities: string[] | null
          seeking_product_id: string
          seeking_quantity: number
          status: string | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          commodity?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          location: string
          offering_product_id: string
          offering_quantity: number
          seeking_commodities?: string[] | null
          seeking_product_id: string
          seeking_quantity: number
          status?: string | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          commodity?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          location?: string
          offering_product_id?: string
          offering_quantity?: number
          seeking_commodities?: string[] | null
          seeking_product_id?: string
          seeking_quantity?: number
          status?: string | null
          unit?: string | null
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
      bulk_orders: {
        Row: {
          created_at: string
          current_participants: number
          deadline: string
          description: string | null
          id: string
          location: string
          organizer_id: string
          product_type: string
          quantity: number
          status: string
          target_price: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number
          deadline: string
          description?: string | null
          id?: string
          location: string
          organizer_id: string
          product_type: string
          quantity: number
          status?: string
          target_price?: number | null
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number
          deadline?: string
          description?: string | null
          id?: string
          location?: string
          organizer_id?: string
          product_type?: string
          quantity?: number
          status?: string
          target_price?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      city_markets: {
        Row: {
          contact_info: Json | null
          coordinates: Json | null
          created_at: string
          facilities: string[] | null
          id: string
          location: string
          market_type: string | null
          name: string
          operating_hours: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          contact_info?: Json | null
          coordinates?: Json | null
          created_at?: string
          facilities?: string[] | null
          id?: string
          location: string
          market_type?: string | null
          name: string
          operating_hours?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          contact_info?: Json | null
          coordinates?: Json | null
          created_at?: string
          facilities?: string[] | null
          id?: string
          location?: string
          market_type?: string | null
          name?: string
          operating_hours?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
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
      donation_requests: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          items_needed: string
          quantity_needed: string | null
          recipient_id: string
          request_type: string
          status: string | null
          updated_at: string
          urgency_level: string | null
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          items_needed: string
          quantity_needed?: string | null
          recipient_id: string
          request_type: string
          status?: string | null
          updated_at?: string
          urgency_level?: string | null
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          items_needed?: string
          quantity_needed?: string | null
          recipient_id?: string
          request_type?: string
          status?: string | null
          updated_at?: string
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_requests_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number | null
          created_at: string
          distribution_date: string | null
          donation_type: string
          donor_id: string
          id: string
          items_description: string | null
          notes: string | null
          recipient_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          distribution_date?: string | null
          donation_type: string
          donor_id: string
          id?: string
          items_description?: string | null
          notes?: string | null
          recipient_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          distribution_date?: string | null
          donation_type?: string
          donor_id?: string
          id?: string
          items_description?: string | null
          notes?: string | null
          recipient_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "donations_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_farm_input_order_items_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "farm_input_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_farm_input_order_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "farm_input_products"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_orders: {
        Row: {
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at: string
          delivery_county: string
          delivery_method: string
          id: string
          status: string
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at?: string
          delivery_county: string
          delivery_method: string
          id?: string
          status?: string
          supplier_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          buyer_name?: string
          buyer_phone?: string
          created_at?: string
          delivery_county?: string
          delivery_method?: string
          id?: string
          status?: string
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_farm_input_orders_supplier"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_products: {
        Row: {
          brand_name: string | null
          created_at: string
          id: string
          is_active: boolean
          price_per_unit: number
          product_category: string
          product_description: string | null
          product_name: string
          stock_quantity: number
          supplier_id: string
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          brand_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          price_per_unit: number
          product_category: string
          product_description?: string | null
          product_name: string
          stock_quantity?: number
          supplier_id: string
          unit_of_measure: string
          updated_at?: string
        }
        Update: {
          brand_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          price_per_unit?: number
          product_category?: string
          product_description?: string | null
          product_name?: string
          stock_quantity?: number
          supplier_id?: string
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_farm_input_products_supplier"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_suppliers: {
        Row: {
          business_registration: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_verified: boolean
          location: string | null
          supplier_name: string
          updated_at: string
        }
        Insert: {
          business_registration?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          location?: string | null
          supplier_name: string
          updated_at?: string
        }
        Update: {
          business_registration?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          location?: string | null
          supplier_name?: string
          updated_at?: string
        }
        Relationships: []
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
      food_rescue_matches: {
        Row: {
          completion_notes: string | null
          created_at: string
          id: string
          listing_id: string
          matched_at: string
          pickup_scheduled_at: string | null
          recipient_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          completion_notes?: string | null
          created_at?: string
          id?: string
          listing_id: string
          matched_at?: string
          pickup_scheduled_at?: string | null
          recipient_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          completion_notes?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          matched_at?: string
          pickup_scheduled_at?: string | null
          recipient_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_rescue_matches_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "food_rescue_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_rescue_matches_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
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
      input_pricing_verification: {
        Row: {
          created_at: string
          id: string
          location: string
          product_name: string
          reported_price: number
          supplier_name: string
          updated_at: string
          user_id: string
          verification_date: string | null
          verified: boolean | null
          verifier_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          product_name: string
          reported_price: number
          supplier_name: string
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verified?: boolean | null
          verifier_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          product_name?: string
          reported_price?: number
          supplier_name?: string
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verified?: boolean | null
          verifier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "input_pricing_verification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "input_pricing_verification_verifier_id_fkey"
            columns: ["verifier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      input_supplier_reviews: {
        Row: {
          created_at: string
          customer_service: number | null
          delivery_timeliness: number | null
          id: string
          product_category: string | null
          product_quality: number | null
          rating: number
          review_text: string | null
          reviewer_id: string
          supplier_name: string
          updated_at: string
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string
          customer_service?: number | null
          delivery_timeliness?: number | null
          id?: string
          product_category?: string | null
          product_quality?: number | null
          rating: number
          review_text?: string | null
          reviewer_id: string
          supplier_name: string
          updated_at?: string
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string
          customer_service?: number | null
          delivery_timeliness?: number | null
          id?: string
          product_category?: string | null
          product_quality?: number | null
          rating?: number
          review_text?: string | null
          reviewer_id?: string
          supplier_name?: string
          updated_at?: string
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "input_supplier_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      market_forecasts: {
        Row: {
          commodity_name: string
          confidence_level: number | null
          county: string
          created_at: string
          current_price: number | null
          forecast_price: number | null
          id: string
          period: string | null
        }
        Insert: {
          commodity_name: string
          confidence_level?: number | null
          county: string
          created_at?: string
          current_price?: number | null
          forecast_price?: number | null
          id?: string
          period?: string | null
        }
        Update: {
          commodity_name?: string
          confidence_level?: number | null
          county?: string
          created_at?: string
          current_price?: number | null
          forecast_price?: number | null
          id?: string
          period?: string | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          commodity_name: string
          county: string
          created_at: string
          date_recorded: string
          id: string
          market_id: string
          market_name: string
          price: number
          unit: string
        }
        Insert: {
          commodity_name: string
          county: string
          created_at?: string
          date_recorded?: string
          id?: string
          market_id: string
          market_name: string
          price: number
          unit: string
        }
        Update: {
          commodity_name?: string
          county?: string
          created_at?: string
          date_recorded?: string
          id?: string
          market_id?: string
          market_name?: string
          price?: number
          unit?: string
        }
        Relationships: []
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
      partner_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          image_url: string | null
          location: string | null
          partner_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          partner_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          partner_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_partner"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
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
      processing_matches: {
        Row: {
          bulk_order_id: string
          created_at: string
          id: string
          negotiation_log: Json | null
          offer_price: number | null
          status: string | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          bulk_order_id: string
          created_at?: string
          id?: string
          negotiation_log?: Json | null
          offer_price?: number | null
          status?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          bulk_order_id?: string
          created_at?: string
          id?: string
          negotiation_log?: Json | null
          offer_price?: number | null
          status?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      produce_inventory: {
        Row: {
          available_for_sale: boolean
          created_at: string
          description: string | null
          expiry_date: string | null
          farmer_id: string
          harvest_date: string | null
          id: string
          images: string[] | null
          location: string
          organic_certified: boolean
          price_per_unit: number | null
          product_name: string
          quality_grade: string
          quantity: number
          storage_conditions: string | null
          unit: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          available_for_sale?: boolean
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id: string
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location: string
          organic_certified?: boolean
          price_per_unit?: number | null
          product_name: string
          quality_grade: string
          quantity: number
          storage_conditions?: string | null
          unit: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          available_for_sale?: boolean
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string
          organic_certified?: boolean
          price_per_unit?: number | null
          product_name?: string
          quality_grade?: string
          quantity?: number
          storage_conditions?: string | null
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: []
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
          location: string | null
          phone_number: string | null
          profile_image_url: string | null
          specialization: string[] | null
          updated_at: string
          user_id: string
          user_type: string | null
          verification_status: string | null
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
          id?: string
          location?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          specialization?: string[] | null
          updated_at?: string
          user_id: string
          user_type?: string | null
          verification_status?: string | null
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
          location?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          specialization?: string[] | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      recipients: {
        Row: {
          capacity_description: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          location: string
          name: string
          organization_type: string
          phone_number: string | null
          requirements: string[] | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          capacity_description?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location: string
          name: string
          organization_type: string
          phone_number?: string | null
          requirements?: string[] | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          capacity_description?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string
          name?: string
          organization_type?: string
          phone_number?: string | null
          requirements?: string[] | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      reverse_bulk_auctions: {
        Row: {
          buyer_id: string
          created_at: string
          deadline: string
          description: string | null
          id: string
          location: string
          max_price: number
          product_name: string
          quantity: number
          status: string | null
          updated_at: string
          winning_bid_id: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string
          deadline: string
          description?: string | null
          id?: string
          location: string
          max_price: number
          product_name: string
          quantity: number
          status?: string | null
          updated_at?: string
          winning_bid_id?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string
          deadline?: string
          description?: string | null
          id?: string
          location?: string
          max_price?: number
          product_name?: string
          quantity?: number
          status?: string | null
          updated_at?: string
          winning_bid_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reverse_bulk_auctions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          helpful_votes: number | null
          id: string
          rating: number
          review_text: string | null
          reviewed_entity_id: string
          reviewed_entity_type: string
          reviewer_id: string
          updated_at: string
          verified_purchase: boolean | null
        }
        Insert: {
          created_at?: string
          helpful_votes?: number | null
          id?: string
          rating: number
          review_text?: string | null
          reviewed_entity_id: string
          reviewed_entity_type: string
          reviewer_id: string
          updated_at?: string
          verified_purchase?: boolean | null
        }
        Update: {
          created_at?: string
          helpful_votes?: number | null
          id?: string
          rating?: number
          review_text?: string | null
          reviewed_entity_id?: string
          reviewed_entity_type?: string
          reviewer_id?: string
          updated_at?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
      success_stories: {
        Row: {
          author_id: string
          category: string | null
          created_at: string
          featured_image_url: string | null
          id: string
          impact_metrics: Json | null
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          story: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          impact_metrics?: Json | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          story: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          impact_metrics?: Json | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          story?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_author_id_fkey"
            columns: ["author_id"]
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
      transporters: {
        Row: {
          available_times: string[] | null
          capacity: string | null
          contact_info: string | null
          counties: string[] | null
          created_at: string
          has_refrigeration: boolean | null
          id: string
          load_capacity: string | null
          name: string
          rates: string | null
          service_type: string | null
          vehicle_type: string | null
        }
        Insert: {
          available_times?: string[] | null
          capacity?: string | null
          contact_info?: string | null
          counties?: string[] | null
          created_at?: string
          has_refrigeration?: boolean | null
          id?: string
          load_capacity?: string | null
          name: string
          rates?: string | null
          service_type?: string | null
          vehicle_type?: string | null
        }
        Update: {
          available_times?: string[] | null
          capacity?: string | null
          contact_info?: string | null
          counties?: string[] | null
          created_at?: string
          has_refrigeration?: boolean | null
          id?: string
          load_capacity?: string | null
          name?: string
          rates?: string | null
          service_type?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      warehouse_bookings: {
        Row: {
          created_at: string
          id: string
          product_type: string
          quantity_tons: number
          special_requirements: string | null
          status: string | null
          storage_end_date: string
          storage_start_date: string
          total_cost: number | null
          updated_at: string
          user_id: string
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_type: string
          quantity_tons: number
          special_requirements?: string | null
          status?: string | null
          storage_end_date: string
          storage_start_date: string
          total_cost?: number | null
          updated_at?: string
          user_id: string
          warehouse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_type?: string
          quantity_tons?: number
          special_requirements?: string | null
          status?: string | null
          storage_end_date?: string
          storage_start_date?: string
          total_cost?: number | null
          updated_at?: string
          user_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "warehouse_bookings_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          capacity_tons: number | null
          contact_info: Json | null
          coordinates: Json | null
          created_at: string
          facilities: string[] | null
          id: string
          location: string
          name: string
          pricing_structure: Json | null
          security_features: string[] | null
          status: string | null
          storage_types: string[] | null
          temperature_controlled: boolean | null
          updated_at: string
        }
        Insert: {
          capacity_tons?: number | null
          contact_info?: Json | null
          coordinates?: Json | null
          created_at?: string
          facilities?: string[] | null
          id?: string
          location: string
          name: string
          pricing_structure?: Json | null
          security_features?: string[] | null
          status?: string | null
          storage_types?: string[] | null
          temperature_controlled?: boolean | null
          updated_at?: string
        }
        Update: {
          capacity_tons?: number | null
          contact_info?: Json | null
          coordinates?: Json | null
          created_at?: string
          facilities?: string[] | null
          id?: string
          location?: string
          name?: string
          pricing_structure?: Json | null
          security_features?: string[] | null
          status?: string | null
          storage_types?: string[] | null
          temperature_controlled?: boolean | null
          updated_at?: string
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

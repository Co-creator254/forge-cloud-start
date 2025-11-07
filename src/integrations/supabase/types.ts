export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agricultural_events: {
        Row: {
          contact_info: Json
          coordinates: Json | null
          county: string
          created_at: string
          currency: string | null
          current_participants: number | null
          description: string
          end_date: string
          entry_fee: number | null
          event_type: string
          id: string
          is_featured: boolean | null
          location: string
          max_participants: number | null
          organizer_id: string
          poster_url: string | null
          registration_deadline: string | null
          requirements: string | null
          start_date: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          what_to_bring: string | null
        }
        Insert: {
          contact_info: Json
          coordinates?: Json | null
          county: string
          created_at?: string
          currency?: string | null
          current_participants?: number | null
          description: string
          end_date: string
          entry_fee?: number | null
          event_type: string
          id?: string
          is_featured?: boolean | null
          location: string
          max_participants?: number | null
          organizer_id: string
          poster_url?: string | null
          registration_deadline?: string | null
          requirements?: string | null
          start_date: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          what_to_bring?: string | null
        }
        Update: {
          contact_info?: Json
          coordinates?: Json | null
          county?: string
          created_at?: string
          currency?: string | null
          current_participants?: number | null
          description?: string
          end_date?: string
          entry_fee?: number | null
          event_type?: string
          id?: string
          is_featured?: boolean | null
          location?: string
          max_participants?: number | null
          organizer_id?: string
          poster_url?: string | null
          registration_deadline?: string | null
          requirements?: string | null
          start_date?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          what_to_bring?: string | null
        }
        Relationships: []
      }
      agricultural_organizations: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          county: string | null
          created_at: string
          description: string
          established_year: number | null
          focus_areas: string[] | null
          id: string
          is_verified: boolean | null
          location: string
          logo_url: string | null
          membership_info: Json | null
          name: string
          organization_type: string
          rating: number | null
          services: string[] | null
          social_media: Json | null
          target_audience: string[] | null
          total_reviews: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string
          description: string
          established_year?: number | null
          focus_areas?: string[] | null
          id?: string
          is_verified?: boolean | null
          location: string
          logo_url?: string | null
          membership_info?: Json | null
          name: string
          organization_type: string
          rating?: number | null
          services?: string[] | null
          social_media?: Json | null
          target_audience?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string
          description?: string
          established_year?: number | null
          focus_areas?: string[] | null
          id?: string
          is_verified?: boolean | null
          location?: string
          logo_url?: string | null
          membership_info?: Json | null
          name?: string
          organization_type?: string
          rating?: number | null
          services?: string[] | null
          social_media?: Json | null
          target_audience?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
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
          {
            foreignKeyName: "app_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      auth_rate_limits: {
        Row: {
          attempt_count: number
          blocked_until: string | null
          created_at: string
          id: string
          last_attempt: string
          user_identifier: string
        }
        Insert: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          id?: string
          last_attempt?: string
          user_identifier: string
        }
        Update: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          id?: string
          last_attempt?: string
          user_identifier?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "barter_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      batch_tracking: {
        Row: {
          batch_number: string
          certifications: string[] | null
          created_at: string
          current_location: string | null
          current_status: string | null
          farmer_id: string
          harvest_date: string
          id: string
          product_name: string
          quality_checks: Json | null
          quality_grade: string | null
          quantity: number
          storage_conditions: Json | null
          transport_history: Json | null
          unit: string
          updated_at: string
        }
        Insert: {
          batch_number: string
          certifications?: string[] | null
          created_at?: string
          current_location?: string | null
          current_status?: string | null
          farmer_id: string
          harvest_date: string
          id?: string
          product_name: string
          quality_checks?: Json | null
          quality_grade?: string | null
          quantity: number
          storage_conditions?: Json | null
          transport_history?: Json | null
          unit: string
          updated_at?: string
        }
        Update: {
          batch_number?: string
          certifications?: string[] | null
          created_at?: string
          current_location?: string | null
          current_status?: string | null
          farmer_id?: string
          harvest_date?: string
          id?: string
          product_name?: string
          quality_checks?: Json | null
          quality_grade?: string | null
          quantity?: number
          storage_conditions?: Json | null
          transport_history?: Json | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      bluetooth_alerts: {
        Row: {
          alert_by_device: string
          alert_by_user: string | null
          alert_type: string
          commodity: string
          contact_info: string | null
          county: string
          created_at: string
          expires_at: string
          id: string
          location: string
          message: string
          threshold_value: number | null
          timestamp: string
        }
        Insert: {
          alert_by_device: string
          alert_by_user?: string | null
          alert_type: string
          commodity: string
          contact_info?: string | null
          county: string
          created_at?: string
          expires_at?: string
          id?: string
          location: string
          message: string
          threshold_value?: number | null
          timestamp?: string
        }
        Update: {
          alert_by_device?: string
          alert_by_user?: string | null
          alert_type?: string
          commodity?: string
          contact_info?: string | null
          county?: string
          created_at?: string
          expires_at?: string
          id?: string
          location?: string
          message?: string
          threshold_value?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      bluetooth_devices: {
        Row: {
          created_at: string
          device_id: string
          device_name: string | null
          id: string
          is_active: boolean
          last_seen: string
          signal_strength: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id: string
          device_name?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string
          signal_strength?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string
          device_name?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string
          signal_strength?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      bluetooth_shared_prices: {
        Row: {
          commodity: string
          contact_info: string | null
          county: string
          created_at: string
          expires_at: string
          id: string
          location: string
          market_name: string
          price: number
          quality_grade: string | null
          shared_by_device: string
          shared_by_user: string | null
          source_type: string
          timestamp: string
          unit: string
          verification_count: number | null
        }
        Insert: {
          commodity: string
          contact_info?: string | null
          county: string
          created_at?: string
          expires_at?: string
          id?: string
          location: string
          market_name: string
          price: number
          quality_grade?: string | null
          shared_by_device: string
          shared_by_user?: string | null
          source_type?: string
          timestamp?: string
          unit: string
          verification_count?: number | null
        }
        Update: {
          commodity?: string
          contact_info?: string | null
          county?: string
          created_at?: string
          expires_at?: string
          id?: string
          location?: string
          market_name?: string
          price?: number
          quality_grade?: string | null
          shared_by_device?: string
          shared_by_user?: string | null
          source_type?: string
          timestamp?: string
          unit?: string
          verification_count?: number | null
        }
        Relationships: []
      }
      bluetooth_traders: {
        Row: {
          announced_by_user: string | null
          commodities: string[] | null
          contact_info: string | null
          county: string
          created_at: string
          device_id: string
          id: string
          last_announced: string
          location: string
          rating: number | null
          services: string[] | null
          trader_name: string
          trader_type: string
        }
        Insert: {
          announced_by_user?: string | null
          commodities?: string[] | null
          contact_info?: string | null
          county: string
          created_at?: string
          device_id: string
          id?: string
          last_announced?: string
          location: string
          rating?: number | null
          services?: string[] | null
          trader_name: string
          trader_type: string
        }
        Update: {
          announced_by_user?: string | null
          commodities?: string[] | null
          contact_info?: string | null
          county?: string
          created_at?: string
          device_id?: string
          id?: string
          last_announced?: string
          location?: string
          rating?: number | null
          services?: string[] | null
          trader_name?: string
          trader_type?: string
        }
        Relationships: []
      }
      bulk_order_bids: {
        Row: {
          bid_price: number
          bidder_id: string
          created_at: string | null
          delivery_terms: string | null
          id: string
          order_id: string
          quantity: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bid_price: number
          bidder_id: string
          created_at?: string | null
          delivery_terms?: string | null
          id?: string
          order_id: string
          quantity: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bid_price?: number
          bidder_id?: string
          created_at?: string | null
          delivery_terms?: string | null
          id?: string
          order_id?: string
          quantity?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_order_bids_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "bulk_orders"
            referencedColumns: ["id"]
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
      buy_requests: {
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
          status: string
          unit: string
          updated_at: string
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
          status?: string
          unit: string
          updated_at?: string
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
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      carbon_emissions: {
        Row: {
          calculation_date: string
          created_at: string
          crop_type: string | null
          electricity_usage: number | null
          emission_unit: string | null
          farm_size: number | null
          fertilizer_usage: number | null
          fuel_consumption: number | null
          id: string
          reduction_actions: string[] | null
          total_emissions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calculation_date?: string
          created_at?: string
          crop_type?: string | null
          electricity_usage?: number | null
          emission_unit?: string | null
          farm_size?: number | null
          fertilizer_usage?: number | null
          fuel_consumption?: number | null
          id?: string
          reduction_actions?: string[] | null
          total_emissions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calculation_date?: string
          created_at?: string
          crop_type?: string | null
          electricity_usage?: number | null
          emission_unit?: string | null
          farm_size?: number | null
          fertilizer_usage?: number | null
          fuel_consumption?: number | null
          id?: string
          reduction_actions?: string[] | null
          total_emissions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      carbon_offset_projects: {
        Row: {
          carbon_offset_potential: number | null
          cost_per_tonne: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          organizer_id: string | null
          participants_count: number | null
          project_name: string
          project_type: string
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          carbon_offset_potential?: number | null
          cost_per_tonne?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          organizer_id?: string | null
          participants_count?: number | null
          project_name: string
          project_type: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          carbon_offset_potential?: number | null
          cost_per_tonne?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          organizer_id?: string | null
          participants_count?: number | null
          project_name?: string
          project_type?: string
          start_date?: string | null
          status?: string | null
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
            foreignKeyName: "community_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
      community_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_reports: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reason: string
          reporter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reason: string
          reporter_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_reports_post_id_fkey"
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
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contract_farming: {
        Row: {
          application_deadline: string
          benefits_offered: string
          contact_email: string | null
          contact_phone: string
          contract_duration: string
          contract_price: number
          contractor_id: string
          contractor_name: string
          contractor_type: string
          county: string
          created_at: string
          crop_type: string
          currency: string | null
          current_applications: number | null
          delivery_terms: string
          harvest_period: string
          id: string
          location: string
          max_farmers: number | null
          payment_terms: string
          planting_season: string
          quality_standards: string
          required_quantity: number
          requirements: string
          status: string | null
          support_provided: string[] | null
          unit: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          application_deadline: string
          benefits_offered: string
          contact_email?: string | null
          contact_phone: string
          contract_duration: string
          contract_price: number
          contractor_id: string
          contractor_name: string
          contractor_type: string
          county: string
          created_at?: string
          crop_type: string
          currency?: string | null
          current_applications?: number | null
          delivery_terms: string
          harvest_period: string
          id?: string
          location: string
          max_farmers?: number | null
          payment_terms: string
          planting_season: string
          quality_standards: string
          required_quantity: number
          requirements: string
          status?: string | null
          support_provided?: string[] | null
          unit: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          application_deadline?: string
          benefits_offered?: string
          contact_email?: string | null
          contact_phone?: string
          contract_duration?: string
          contract_price?: number
          contractor_id?: string
          contractor_name?: string
          contractor_type?: string
          county?: string
          created_at?: string
          crop_type?: string
          currency?: string | null
          current_applications?: number | null
          delivery_terms?: string
          harvest_period?: string
          id?: string
          location?: string
          max_farmers?: number | null
          payment_terms?: string
          planting_season?: string
          quality_standards?: string
          required_quantity?: number
          requirements?: string
          status?: string | null
          support_provided?: string[] | null
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: []
      }
      cooperative_activities: {
        Row: {
          activity_date: string
          activity_type: string
          created_at: string
          description: string | null
          financial_impact: number | null
          group_id: string
          id: string
          outcome: string | null
          participants: string[] | null
          updated_at: string
        }
        Insert: {
          activity_date: string
          activity_type: string
          created_at?: string
          description?: string | null
          financial_impact?: number | null
          group_id: string
          id?: string
          outcome?: string | null
          participants?: string[] | null
          updated_at?: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          created_at?: string
          description?: string | null
          financial_impact?: number | null
          group_id?: string
          id?: string
          outcome?: string | null
          participants?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cooperative_activities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cooperative_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      cooperative_dividends: {
        Row: {
          created_at: string
          declaration_date: string
          dividend_per_share: number
          financial_year: string
          group_id: string
          id: string
          payment_date: string | null
          status: string | null
          total_profit: number
        }
        Insert: {
          created_at?: string
          declaration_date: string
          dividend_per_share: number
          financial_year: string
          group_id: string
          id?: string
          payment_date?: string | null
          status?: string | null
          total_profit: number
        }
        Update: {
          created_at?: string
          declaration_date?: string
          dividend_per_share?: number
          financial_year?: string
          group_id?: string
          id?: string
          payment_date?: string | null
          status?: string | null
          total_profit?: number
        }
        Relationships: [
          {
            foreignKeyName: "cooperative_dividends_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cooperative_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      cooperative_groups: {
        Row: {
          activities: string[] | null
          bank_account_info: Json | null
          contact_email: string | null
          contact_person: string
          contact_phone: string
          coordinates: Json | null
          county: string
          created_at: string
          crops_traded: string[] | null
          description: string | null
          documents: Json | null
          founded_date: string | null
          group_leader_id: string | null
          group_type: string
          id: string
          is_verified: boolean | null
          location: string
          logo_url: string | null
          meeting_schedule: string | null
          member_count: number | null
          membership_fee: number | null
          name: string
          registration_number: string | null
          services_offered: string[] | null
          share_value: number | null
          status: string | null
          total_shares: number | null
          updated_at: string
        }
        Insert: {
          activities?: string[] | null
          bank_account_info?: Json | null
          contact_email?: string | null
          contact_person: string
          contact_phone: string
          coordinates?: Json | null
          county: string
          created_at?: string
          crops_traded?: string[] | null
          description?: string | null
          documents?: Json | null
          founded_date?: string | null
          group_leader_id?: string | null
          group_type: string
          id?: string
          is_verified?: boolean | null
          location: string
          logo_url?: string | null
          meeting_schedule?: string | null
          member_count?: number | null
          membership_fee?: number | null
          name: string
          registration_number?: string | null
          services_offered?: string[] | null
          share_value?: number | null
          status?: string | null
          total_shares?: number | null
          updated_at?: string
        }
        Update: {
          activities?: string[] | null
          bank_account_info?: Json | null
          contact_email?: string | null
          contact_person?: string
          contact_phone?: string
          coordinates?: Json | null
          county?: string
          created_at?: string
          crops_traded?: string[] | null
          description?: string | null
          documents?: Json | null
          founded_date?: string | null
          group_leader_id?: string | null
          group_type?: string
          id?: string
          is_verified?: boolean | null
          location?: string
          logo_url?: string | null
          meeting_schedule?: string | null
          member_count?: number | null
          membership_fee?: number | null
          name?: string
          registration_number?: string | null
          services_offered?: string[] | null
          share_value?: number | null
          status?: string | null
          total_shares?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cooperative_loans: {
        Row: {
          approval_date: string | null
          borrower_id: string
          created_at: string
          disbursement_date: string | null
          group_id: string
          id: string
          interest_rate: number
          loan_amount: number
          loan_purpose: string | null
          outstanding_balance: number | null
          repayment_period: number | null
          repayment_schedule: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          borrower_id: string
          created_at?: string
          disbursement_date?: string | null
          group_id: string
          id?: string
          interest_rate: number
          loan_amount: number
          loan_purpose?: string | null
          outstanding_balance?: number | null
          repayment_period?: number | null
          repayment_schedule?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          borrower_id?: string
          created_at?: string
          disbursement_date?: string | null
          group_id?: string
          id?: string
          interest_rate?: number
          loan_amount?: number
          loan_purpose?: string | null
          outstanding_balance?: number | null
          repayment_period?: number | null
          repayment_schedule?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cooperative_loans_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cooperative_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      cooperative_votes: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          group_id: string
          id: string
          options: Json
          results: Json | null
          start_date: string
          status: string | null
          title: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          group_id: string
          id?: string
          options: Json
          results?: Json | null
          start_date?: string
          status?: string | null
          title: string
          vote_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          group_id?: string
          id?: string
          options?: Json
          results?: Json | null
          start_date?: string
          status?: string | null
          title?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cooperative_votes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cooperative_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          actual_harvest_date: string | null
          area: number
          area_unit: string
          created_at: string
          current_yield: number | null
          expected_harvest_date: string | null
          id: string
          name: string
          notes: string | null
          parcel_id: string | null
          planting_date: string | null
          previous_yield: number | null
          quality: string | null
          status: string
          updated_at: string
          user_id: string
          variety: string | null
          yield_unit: string | null
        }
        Insert: {
          actual_harvest_date?: string | null
          area: number
          area_unit?: string
          created_at?: string
          current_yield?: number | null
          expected_harvest_date?: string | null
          id?: string
          name: string
          notes?: string | null
          parcel_id?: string | null
          planting_date?: string | null
          previous_yield?: number | null
          quality?: string | null
          status?: string
          updated_at?: string
          user_id: string
          variety?: string | null
          yield_unit?: string | null
        }
        Update: {
          actual_harvest_date?: string | null
          area?: number
          area_unit?: string
          created_at?: string
          current_yield?: number | null
          expected_harvest_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          parcel_id?: string | null
          planting_date?: string | null
          previous_yield?: number | null
          quality?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          variety?: string | null
          yield_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crops_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_hotspots: {
        Row: {
          avg_price: number | null
          buyer_count: number | null
          commodity: string
          county: string
          created_at: string
          demand_level: string
          description: string | null
          id: string
          last_updated: string
          location: string
          price_trend: string | null
        }
        Insert: {
          avg_price?: number | null
          buyer_count?: number | null
          commodity: string
          county: string
          created_at?: string
          demand_level: string
          description?: string | null
          id?: string
          last_updated?: string
          location: string
          price_trend?: string | null
        }
        Update: {
          avg_price?: number | null
          buyer_count?: number | null
          commodity?: string
          county?: string
          created_at?: string
          demand_level?: string
          description?: string | null
          id?: string
          last_updated?: string
          location?: string
          price_trend?: string | null
        }
        Relationships: []
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
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
      equipment_marketplace: {
        Row: {
          availability_status: string | null
          brand: string | null
          condition: string
          contact_email: string | null
          contact_phone: string | null
          county: string
          created_at: string
          currency: string | null
          description: string
          equipment_name: string
          equipment_type: string
          id: string
          images: string[] | null
          is_featured: boolean | null
          location: string
          model: string | null
          negotiable: boolean | null
          price: number
          rental_option: boolean | null
          rental_price_per_day: number | null
          seller_id: string
          specifications: Json | null
          tags: string[] | null
          updated_at: string
          view_count: number | null
          year_manufactured: number | null
        }
        Insert: {
          availability_status?: string | null
          brand?: string | null
          condition: string
          contact_email?: string | null
          contact_phone?: string | null
          county: string
          created_at?: string
          currency?: string | null
          description: string
          equipment_name: string
          equipment_type: string
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location: string
          model?: string | null
          negotiable?: boolean | null
          price: number
          rental_option?: boolean | null
          rental_price_per_day?: number | null
          seller_id: string
          specifications?: Json | null
          tags?: string[] | null
          updated_at?: string
          view_count?: number | null
          year_manufactured?: number | null
        }
        Update: {
          availability_status?: string | null
          brand?: string | null
          condition?: string
          contact_email?: string | null
          contact_phone?: string | null
          county?: string
          created_at?: string
          currency?: string | null
          description?: string
          equipment_name?: string
          equipment_type?: string
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location?: string
          model?: string | null
          negotiable?: boolean | null
          price?: number
          rental_option?: boolean | null
          rental_price_per_day?: number | null
          seller_id?: string
          specifications?: Json | null
          tags?: string[] | null
          updated_at?: string
          view_count?: number | null
          year_manufactured?: number | null
        }
        Relationships: []
      }
      export_opportunities: {
        Row: {
          certifications_required: string[] | null
          commodity: string
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          deadline: string
          delivery_terms: string | null
          description: string | null
          id: string
          payment_terms: string | null
          price_per_unit: number
          quality_requirements: string | null
          quantity_required: number
          status: string | null
          target_country: string
          target_region: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          certifications_required?: string[] | null
          commodity: string
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deadline: string
          delivery_terms?: string | null
          description?: string | null
          id?: string
          payment_terms?: string | null
          price_per_unit: number
          quality_requirements?: string | null
          quantity_required: number
          status?: string | null
          target_country: string
          target_region?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          certifications_required?: string[] | null
          commodity?: string
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deadline?: string
          delivery_terms?: string | null
          description?: string | null
          id?: string
          payment_terms?: string | null
          price_per_unit?: number
          quality_requirements?: string | null
          quantity_required?: number
          status?: string | null
          target_country?: string
          target_region?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      export_opportunity_applications: {
        Row: {
          applicant_id: string
          certifications: string[] | null
          created_at: string
          delivery_timeline: string | null
          id: string
          notes: string | null
          opportunity_id: string
          price_per_unit: number
          quantity_offered: number
          status: string | null
        }
        Insert: {
          applicant_id: string
          certifications?: string[] | null
          created_at?: string
          delivery_timeline?: string | null
          id?: string
          notes?: string | null
          opportunity_id: string
          price_per_unit: number
          quantity_offered: number
          status?: string | null
        }
        Update: {
          applicant_id?: string
          certifications?: string[] | null
          created_at?: string
          delivery_timeline?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string
          price_per_unit?: number
          quantity_offered?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_opportunity_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "export_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_budgets: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string
          id: string
          notes: string | null
          planned_amount: number
          subcategory: string | null
          updated_at: string
          user_id: string
          variance: number | null
          year: number
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          planned_amount: number
          subcategory?: string | null
          updated_at?: string
          user_id: string
          variance?: number | null
          year: number
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          planned_amount?: number
          subcategory?: string | null
          updated_at?: string
          user_id?: string
          variance?: number | null
          year?: number
        }
        Relationships: []
      }
      farm_input_ban_recommendations: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          evidence: string | null
          id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          evidence?: string | null
          id?: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          evidence?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
        }
        Relationships: []
      }
      farm_input_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      farm_input_entity_flags: {
        Row: {
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
        }
        Relationships: []
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
      farm_input_product_bookmarks: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_input_product_likes: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_input_product_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      farm_input_supplier_likes: {
        Row: {
          created_at: string
          id: string
          supplier_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          supplier_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          supplier_id?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_input_supplier_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          supplier_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          supplier_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          supplier_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      farm_inventory: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          id: string
          item_name: string
          location: string | null
          minimum_quantity: number | null
          notes: string | null
          purchase_date: string | null
          quantity: number
          supplier: string | null
          total_value: number | null
          unit: string
          unit_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_name: string
          location?: string | null
          minimum_quantity?: number | null
          notes?: string | null
          purchase_date?: string | null
          quantity: number
          supplier?: string | null
          total_value?: number | null
          unit: string
          unit_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_name?: string
          location?: string | null
          minimum_quantity?: number | null
          notes?: string | null
          purchase_date?: string | null
          quantity?: number
          supplier?: string | null
          total_value?: number | null
          unit?: string
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_statistics: {
        Row: {
          active_parcels: number | null
          created_at: string
          id: string
          last_calculated: string | null
          total_crops: number | null
          total_expenses: number | null
          total_land_area: number | null
          total_profit: number | null
          total_revenue: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_parcels?: number | null
          created_at?: string
          id?: string
          last_calculated?: string | null
          total_crops?: number | null
          total_expenses?: number | null
          total_land_area?: number | null
          total_profit?: number | null
          total_revenue?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_parcels?: number | null
          created_at?: string
          id?: string
          last_calculated?: string | null
          total_crops?: number | null
          total_expenses?: number | null
          total_land_area?: number | null
          total_profit?: number | null
          total_revenue?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_tourism_hosts: {
        Row: {
          amenities: string[] | null
          availability: Json | null
          business_type: string
          contact_email: string | null
          contact_phone: string | null
          coordinates: Json | null
          county: string
          created_at: string
          crops: string[] | null
          description: string
          farm_name: string
          host_id: string
          id: string
          image_urls: string[] | null
          is_verified: boolean | null
          livestock: string[] | null
          location: string
          pricing: Json | null
          rating: number | null
          social_media: Json | null
          total_reviews: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          amenities?: string[] | null
          availability?: Json | null
          business_type: string
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json | null
          county: string
          created_at?: string
          crops?: string[] | null
          description: string
          farm_name: string
          host_id: string
          id?: string
          image_urls?: string[] | null
          is_verified?: boolean | null
          livestock?: string[] | null
          location: string
          pricing?: Json | null
          rating?: number | null
          social_media?: Json | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          amenities?: string[] | null
          availability?: Json | null
          business_type?: string
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json | null
          county?: string
          created_at?: string
          crops?: string[] | null
          description?: string
          farm_name?: string
          host_id?: string
          id?: string
          image_urls?: string[] | null
          is_verified?: boolean | null
          livestock?: string[] | null
          location?: string
          pricing?: Json | null
          rating?: number | null
          social_media?: Json | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      farm_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          crop_id: string | null
          currency: string
          description: string | null
          id: string
          parcel_id: string | null
          payment_method: string | null
          reference_number: string | null
          subcategory: string | null
          transaction_date: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          crop_id?: string | null
          currency?: string
          description?: string | null
          id?: string
          parcel_id?: string | null
          payment_method?: string | null
          reference_number?: string | null
          subcategory?: string | null
          transaction_date?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          crop_id?: string | null
          currency?: string
          description?: string | null
          id?: string
          parcel_id?: string | null
          payment_method?: string | null
          reference_number?: string | null
          subcategory?: string | null
          transaction_date?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_transactions_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_transactions_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "farms_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
            foreignKeyName: "food_rescue_listings_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
            foreignKeyName: "group_input_orders_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "group_input_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "group_input_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_members: {
        Row: {
          contribution_balance: number | null
          created_at: string
          group_id: string
          id: string
          join_date: string | null
          member_role: string | null
          membership_status: string | null
          shares_owned: number | null
          user_id: string
        }
        Insert: {
          contribution_balance?: number | null
          created_at?: string
          group_id: string
          id?: string
          join_date?: string | null
          member_role?: string | null
          membership_status?: string | null
          shares_owned?: number | null
          user_id: string
        }
        Update: {
          contribution_balance?: number | null
          created_at?: string
          group_id?: string
          id?: string
          join_date?: string | null
          member_role?: string | null
          membership_status?: string | null
          shares_owned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cooperative_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          group_id: string
          id: string
          is_priority: boolean | null
          message_text: string
          message_type: string | null
          read_by: string[] | null
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          group_id: string
          id?: string
          is_priority?: boolean | null
          message_text: string
          message_type?: string | null
          read_by?: string[] | null
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          group_id?: string
          id?: string
          is_priority?: boolean | null
          message_text?: string
          message_type?: string | null
          read_by?: string[] | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cooperative_groups"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "group_order_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_transactions: {
        Row: {
          amount: number
          approved_by: string | null
          created_at: string
          currency: string | null
          description: string | null
          group_id: string
          id: string
          member_id: string | null
          reference_number: string | null
          status: string | null
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          group_id: string
          id?: string
          member_id?: string | null
          reference_number?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          group_id?: string
          id?: string
          member_id?: string | null
          reference_number?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_transactions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cooperative_groups"
            referencedColumns: ["id"]
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
            foreignKeyName: "input_pricing_verification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "input_pricing_verification_verifier_id_fkey"
            columns: ["verifier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "input_pricing_verification_verifier_id_fkey"
            columns: ["verifier_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
          {
            foreignKeyName: "input_supplier_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      land_parcels: {
        Row: {
          created_at: string
          crop: string | null
          id: string
          irrigation_type: string | null
          last_harvest: string | null
          latitude: number | null
          longitude: number | null
          name: string
          next_harvest_date: string | null
          notes: string | null
          size: number
          soil_type: string | null
          status: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop?: string | null
          id?: string
          irrigation_type?: string | null
          last_harvest?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          next_harvest_date?: string | null
          notes?: string | null
          size: number
          soil_type?: string | null
          status?: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop?: string | null
          id?: string
          irrigation_type?: string | null
          last_harvest?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          next_harvest_date?: string | null
          notes?: string | null
          size?: number
          soil_type?: string | null
          status?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loan_repayments: {
        Row: {
          amount: number
          created_at: string
          id: string
          loan_id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          payment_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          loan_id: string
          notes?: string | null
          payment_date: string
          payment_method?: string | null
          payment_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          loan_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          payment_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_repayments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "cooperative_loans"
            referencedColumns: ["id"]
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
      market_linkages: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          contact_info: string
          counties: string[] | null
          created_at: string | null
          created_by: string
          crops_involved: string[] | null
          description: string
          duration_months: number | null
          id: string
          linkage_type: string
          max_participants: number | null
          minimum_quantity: number | null
          participants_count: number | null
          price_range: string | null
          requirements: string[] | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info: string
          counties?: string[] | null
          created_at?: string | null
          created_by: string
          crops_involved?: string[] | null
          description: string
          duration_months?: number | null
          id?: string
          linkage_type: string
          max_participants?: number | null
          minimum_quantity?: number | null
          participants_count?: number | null
          price_range?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info?: string
          counties?: string[] | null
          created_at?: string | null
          created_by?: string
          crops_involved?: string[] | null
          description?: string
          duration_months?: number | null
          id?: string
          linkage_type?: string
          max_participants?: number | null
          minimum_quantity?: number | null
          participants_count?: number | null
          price_range?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
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
      market_reports: {
        Row: {
          created_at: string
          details: string
          id: string
          market_id: string
          report_type: string
          reporter_id: string | null
          reporter_name: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          details: string
          id?: string
          market_id: string
          report_type: string
          reporter_id?: string | null
          reporter_name: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          details?: string
          id?: string
          market_id?: string
          report_type?: string
          reporter_id?: string | null
          reporter_name?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "market_reports_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "road_markets"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "marketplace_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      member_dividend_payments: {
        Row: {
          amount: number
          created_at: string
          dividend_id: string
          id: string
          member_id: string
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          shares_held: number
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          dividend_id: string
          id?: string
          member_id: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          shares_held: number
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          dividend_id?: string
          id?: string
          member_id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          shares_held?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_dividend_payments_dividend_id_fkey"
            columns: ["dividend_id"]
            isOneToOne: false
            referencedRelation: "cooperative_dividends"
            referencedColumns: ["id"]
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
            foreignKeyName: "my_trades_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
          {
            foreignKeyName: "my_trades_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_reference: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
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
      reverse_auction_bids: {
        Row: {
          auction_id: string
          bid_price: number
          bidder_id: string
          created_at: string | null
          delivery_timeframe: string | null
          id: string
          quantity_offered: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auction_id: string
          bid_price: number
          bidder_id: string
          created_at?: string | null
          delivery_timeframe?: string | null
          id?: string
          quantity_offered: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auction_id?: string
          bid_price?: number
          bidder_id?: string
          created_at?: string | null
          delivery_timeframe?: string | null
          id?: string
          quantity_offered?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reverse_auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "reverse_bulk_auctions"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "reverse_bulk_auctions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      road_markets: {
        Row: {
          active_vendors: number | null
          contact_info: string | null
          coordinates: Json | null
          county: string
          created_at: string
          facilities: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          market_days: string[] | null
          name: string
          road: string
          updated_at: string
        }
        Insert: {
          active_vendors?: number | null
          contact_info?: string | null
          coordinates?: Json | null
          county: string
          created_at?: string
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          market_days?: string[] | null
          name: string
          road: string
          updated_at?: string
        }
        Update: {
          active_vendors?: number | null
          contact_info?: string | null
          coordinates?: Json | null
          county?: string
          created_at?: string
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          market_days?: string[] | null
          name?: string
          road?: string
          updated_at?: string
        }
        Relationships: []
      }
      route_vendors: {
        Row: {
          contact: string | null
          county: string
          created_at: string
          id: string
          image_url: string | null
          location: string
          products: string[]
          rating: number | null
          route: string
          updated_at: string
          vendor_name: string
          verified: boolean | null
        }
        Insert: {
          contact?: string | null
          county: string
          created_at?: string
          id?: string
          image_url?: string | null
          location: string
          products: string[]
          rating?: number | null
          route: string
          updated_at?: string
          vendor_name: string
          verified?: boolean | null
        }
        Update: {
          contact?: string | null
          county?: string
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string
          products?: string[]
          rating?: number | null
          route?: string
          updated_at?: string
          vendor_name?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
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
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subscription_box_deliveries: {
        Row: {
          box_id: string
          created_at: string | null
          delivered: boolean | null
          delivery_date: string
          id: string
        }
        Insert: {
          box_id: string
          created_at?: string | null
          delivered?: boolean | null
          delivery_date: string
          id?: string
        }
        Update: {
          box_id?: string
          created_at?: string | null
          delivered?: boolean | null
          delivery_date?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_box_deliveries_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "subscription_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_boxes: {
        Row: {
          box_type: string
          consumer_id: string
          created_at: string | null
          duration_months: number
          farmer_id: string | null
          frequency: string
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          box_type: string
          consumer_id: string
          created_at?: string | null
          duration_months: number
          farmer_id?: string | null
          frequency: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          box_type?: string
          consumer_id?: string
          created_at?: string | null
          duration_months?: number
          farmer_id?: string | null
          frequency?: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "success_stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
        ]
      }
      supply_chain_financial_analysis: {
        Row: {
          amount: number
          cost_type: string
          created_at: string
          currency: string | null
          id: string
          notes: string | null
          stage_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          cost_type: string
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          stage_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          cost_type?: string
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          stage_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_financial_analysis_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "supply_chain_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_chain_stages: {
        Row: {
          created_at: string
          crop_id: string | null
          data: Json | null
          end_date: string | null
          farm_id: string | null
          id: string
          issues: Json | null
          progress: number | null
          stage_name: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          data?: Json | null
          end_date?: string | null
          farm_id?: string | null
          id?: string
          issues?: Json | null
          progress?: number | null
          stage_name: string
          start_date?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          data?: Json | null
          end_date?: string | null
          farm_id?: string | null
          id?: string
          issues?: Json | null
          progress?: number | null
          stage_name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_stages_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_chain_stages_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      training_events: {
        Row: {
          certificate_provided: boolean | null
          contact_info: string | null
          cost: number | null
          county: string | null
          created_at: string
          current_participants: number | null
          description: string | null
          end_date: string
          event_type: string | null
          fee: number | null
          id: string
          is_active: boolean | null
          is_online: boolean | null
          location: string | null
          materials_provided: string[] | null
          max_participants: number | null
          meeting_link: string | null
          organizer_id: string
          registration_deadline: string | null
          requirements: string | null
          start_date: string
          status: string | null
          target_audience: string[] | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          certificate_provided?: boolean | null
          contact_info?: string | null
          cost?: number | null
          county?: string | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date: string
          event_type?: string | null
          fee?: number | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location?: string | null
          materials_provided?: string[] | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id: string
          registration_deadline?: string | null
          requirements?: string | null
          start_date: string
          status?: string | null
          target_audience?: string[] | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          certificate_provided?: boolean | null
          contact_info?: string | null
          cost?: number | null
          county?: string | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string
          event_type?: string | null
          fee?: number | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location?: string | null
          materials_provided?: string[] | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string
          registration_deadline?: string | null
          requirements?: string | null
          start_date?: string
          status?: string | null
          target_audience?: string[] | null
          title?: string
          topics?: string[] | null
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
          {
            foreignKeyName: "training_events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
            foreignKeyName: "transportation_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transportation_requests_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transportation_requests_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
            foreignKeyName: "warehouse_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_directory"
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
      weather_forecasts: {
        Row: {
          agricultural_advisory: string | null
          coordinates: Json
          county: string
          created_at: string
          forecast_date: string
          harvesting_recommendation: string | null
          humidity: number | null
          id: string
          location: string
          pest_disease_alert: string | null
          planting_recommendation: string | null
          pressure: number | null
          rainfall: number | null
          temperature_max: number | null
          temperature_min: number | null
          updated_at: string
          uv_index: number | null
          visibility: number | null
          weather_condition: string
          weather_description: string | null
          wind_direction: string | null
          wind_speed: number | null
        }
        Insert: {
          agricultural_advisory?: string | null
          coordinates: Json
          county: string
          created_at?: string
          forecast_date: string
          harvesting_recommendation?: string | null
          humidity?: number | null
          id?: string
          location: string
          pest_disease_alert?: string | null
          planting_recommendation?: string | null
          pressure?: number | null
          rainfall?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          updated_at?: string
          uv_index?: number | null
          visibility?: number | null
          weather_condition: string
          weather_description?: string | null
          wind_direction?: string | null
          wind_speed?: number | null
        }
        Update: {
          agricultural_advisory?: string | null
          coordinates?: Json
          county?: string
          created_at?: string
          forecast_date?: string
          harvesting_recommendation?: string | null
          humidity?: number | null
          id?: string
          location?: string
          pest_disease_alert?: string | null
          planting_recommendation?: string | null
          pressure?: number | null
          rainfall?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          updated_at?: string
          uv_index?: number | null
          visibility?: number | null
          weather_condition?: string
          weather_description?: string | null
          wind_direction?: string | null
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      equipment_listings_public: {
        Row: {
          availability_status: string | null
          brand: string | null
          condition: string | null
          county: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          equipment_name: string | null
          equipment_type: string | null
          id: string | null
          images: string[] | null
          is_featured: boolean | null
          location: string | null
          model: string | null
          negotiable: boolean | null
          price: number | null
          rental_option: boolean | null
          rental_price_per_day: number | null
          seller_id: string | null
          updated_at: string | null
          view_count: number | null
          year_manufactured: number | null
        }
        Insert: {
          availability_status?: string | null
          brand?: string | null
          condition?: string | null
          county?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          equipment_name?: string | null
          equipment_type?: string | null
          id?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          location?: string | null
          model?: string | null
          negotiable?: boolean | null
          price?: number | null
          rental_option?: boolean | null
          rental_price_per_day?: number | null
          seller_id?: string | null
          updated_at?: string | null
          view_count?: number | null
          year_manufactured?: number | null
        }
        Update: {
          availability_status?: string | null
          brand?: string | null
          condition?: string | null
          county?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          equipment_name?: string | null
          equipment_type?: string | null
          id?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          location?: string | null
          model?: string | null
          negotiable?: boolean | null
          price?: number | null
          rental_option?: boolean | null
          rental_price_per_day?: number | null
          seller_id?: string | null
          updated_at?: string | null
          view_count?: number | null
          year_manufactured?: number | null
        }
        Relationships: []
      }
      user_directory: {
        Row: {
          county: string | null
          created_at: string | null
          full_name: string | null
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          county?: string | null
          created_at?: string | null
          full_name?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          county?: string | null
          created_at?: string | null
          full_name?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_bluetooth_data: { Args: never; Returns: undefined }
      cleanup_old_training_events: { Args: never; Returns: undefined }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_supplier_for_order: {
        Args: { order_supplier_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "agent" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "agent", "user"],
    },
  },
} as const

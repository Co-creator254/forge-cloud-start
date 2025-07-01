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
      barter_listings: {
        Row: {
          commodity: string
          county: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          location: string
          quantity: number
          seeking_commodities: string[]
          status: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commodity: string
          county: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          location: string
          quantity: number
          seeking_commodities: string[]
          status?: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commodity?: string
          county?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          location?: string
          quantity?: number
          seeking_commodities?: string[]
          status?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      crop_tracking: {
        Row: {
          actual_harvest_date: string | null
          actual_yield: number | null
          created_at: string
          crop_name: string
          estimated_yield: number | null
          expected_harvest_date: string | null
          fertilizer_applied: Json | null
          growth_stage: string | null
          id: string
          irrigation_schedule: Json | null
          notes: string | null
          parcel_id: string | null
          pesticides_applied: Json | null
          planted_area: number
          planting_date: string
          quality_grade: string | null
          seeds_used: number | null
          updated_at: string
          user_id: string
          variety: string | null
        }
        Insert: {
          actual_harvest_date?: string | null
          actual_yield?: number | null
          created_at?: string
          crop_name: string
          estimated_yield?: number | null
          expected_harvest_date?: string | null
          fertilizer_applied?: Json | null
          growth_stage?: string | null
          id?: string
          irrigation_schedule?: Json | null
          notes?: string | null
          parcel_id?: string | null
          pesticides_applied?: Json | null
          planted_area: number
          planting_date: string
          quality_grade?: string | null
          seeds_used?: number | null
          updated_at?: string
          user_id: string
          variety?: string | null
        }
        Update: {
          actual_harvest_date?: string | null
          actual_yield?: number | null
          created_at?: string
          crop_name?: string
          estimated_yield?: number | null
          expected_harvest_date?: string | null
          fertilizer_applied?: Json | null
          growth_stage?: string | null
          id?: string
          irrigation_schedule?: Json | null
          notes?: string | null
          parcel_id?: string | null
          pesticides_applied?: Json | null
          planted_area?: number
          planting_date?: string
          quality_grade?: string | null
          seeds_used?: number | null
          updated_at?: string
          user_id?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_tracking_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "farm_parcels"
            referencedColumns: ["id"]
          },
        ]
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
      farm_parcels: {
        Row: {
          coordinates: Json | null
          created_at: string
          current_crop: string | null
          expected_harvest: string | null
          id: string
          irrigation_system: string | null
          is_active: boolean | null
          notes: string | null
          parcel_name: string
          planting_date: string | null
          size_acres: number
          slope_type: string | null
          soil_type: string | null
          updated_at: string
          user_id: string
          water_source: string | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          current_crop?: string | null
          expected_harvest?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          notes?: string | null
          parcel_name: string
          planting_date?: string | null
          size_acres: number
          slope_type?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id: string
          water_source?: string | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          current_crop?: string | null
          expected_harvest?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          notes?: string | null
          parcel_name?: string
          planting_date?: string | null
          size_acres?: number
          slope_type?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id?: string
          water_source?: string | null
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
      market_linkage_applications: {
        Row: {
          application_status: string | null
          applied_at: string
          contact_phone: string
          crops_to_supply: string[]
          estimated_quantity: number | null
          farm_size: number | null
          farmer_name: string
          id: string
          linkage_id: string
          notes: string | null
          reviewed_at: string | null
          reviewer_notes: string | null
          user_id: string
        }
        Insert: {
          application_status?: string | null
          applied_at?: string
          contact_phone: string
          crops_to_supply: string[]
          estimated_quantity?: number | null
          farm_size?: number | null
          farmer_name: string
          id?: string
          linkage_id: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          user_id: string
        }
        Update: {
          application_status?: string | null
          applied_at?: string
          contact_phone?: string
          crops_to_supply?: string[]
          estimated_quantity?: number | null
          farm_size?: number | null
          farmer_name?: string
          id?: string
          linkage_id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_linkage_applications_linkage_id_fkey"
            columns: ["linkage_id"]
            isOneToOne: false
            referencedRelation: "market_linkages"
            referencedColumns: ["id"]
          },
        ]
      }
      market_linkages: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          contact_info: string
          counties: string[]
          created_at: string
          created_by: string | null
          crops_involved: string[]
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
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info: string
          counties: string[]
          created_at?: string
          created_by?: string | null
          crops_involved: string[]
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
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info?: string
          counties?: string[]
          created_at?: string
          created_by?: string | null
          crops_involved?: string[]
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
          updated_at?: string
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
      produce_inventory: {
        Row: {
          available_for_sale: boolean | null
          created_at: string
          description: string | null
          expiry_date: string | null
          farmer_id: string | null
          harvest_date: string | null
          id: string
          images: string[] | null
          location: string
          organic_certified: boolean | null
          price_per_unit: number | null
          product_name: string
          quality_grade: string | null
          quantity: number
          storage_conditions: string | null
          unit: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          available_for_sale?: boolean | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location: string
          organic_certified?: boolean | null
          price_per_unit?: number | null
          product_name: string
          quality_grade?: string | null
          quantity: number
          storage_conditions?: string | null
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          available_for_sale?: boolean | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string
          organic_certified?: boolean | null
          price_per_unit?: number | null
          product_name?: string
          quality_grade?: string | null
          quantity?: number
          storage_conditions?: string | null
          unit?: string
          updated_at?: string
          variety?: string | null
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
      quality_control_discussions: {
        Row: {
          attendees: number | null
          author_name: string
          author_type: string
          county: string
          created_at: string
          date: string
          description: string
          id: string
          is_active: boolean | null
          location: string
          organizer: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: number | null
          author_name: string
          author_type: string
          county: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_active?: boolean | null
          location: string
          organizer: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: number | null
          author_name?: string
          author_type?: string
          county?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string
          organizer?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_provider_reviews: {
        Row: {
          created_at: string
          id: string
          provider_id: string
          rating: number
          review_text: string | null
          service_used: string
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          provider_id: string
          rating: number
          review_text?: string | null
          service_used: string
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          provider_id?: string
          rating?: number
          review_text?: string | null
          service_used?: string
          user_id?: string
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "service_provider_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          availability: string | null
          business_name: string
          certifications: string[] | null
          contact_email: string
          contact_phone: string | null
          counties_served: string[] | null
          created_at: string
          description: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          location: string
          rating: number | null
          service_type: string
          services_offered: string[] | null
          total_jobs: number | null
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          availability?: string | null
          business_name: string
          certifications?: string[] | null
          contact_email: string
          contact_phone?: string | null
          counties_served?: string[] | null
          created_at?: string
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location: string
          rating?: number | null
          service_type: string
          services_offered?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          availability?: string | null
          business_name?: string
          certifications?: string[] | null
          contact_email?: string
          contact_phone?: string | null
          counties_served?: string[] | null
          created_at?: string
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location?: string
          rating?: number | null
          service_type?: string
          services_offered?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      training_events: {
        Row: {
          certificate_provided: boolean | null
          contact_info: string
          cost: number | null
          county: string
          created_at: string
          current_participants: number | null
          description: string
          end_date: string
          event_type: string
          id: string
          is_active: boolean | null
          is_online: boolean | null
          location: string
          materials_provided: boolean | null
          max_participants: number | null
          meeting_link: string | null
          organizer_id: string | null
          registration_deadline: string | null
          requirements: string[] | null
          start_date: string
          status: string | null
          target_audience: string[] | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          certificate_provided?: boolean | null
          contact_info: string
          cost?: number | null
          county: string
          created_at?: string
          current_participants?: number | null
          description: string
          end_date: string
          event_type: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location: string
          materials_provided?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date: string
          status?: string | null
          target_audience?: string[] | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          certificate_provided?: boolean | null
          contact_info?: string
          cost?: number | null
          county?: string
          created_at?: string
          current_participants?: number | null
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location?: string
          materials_provided?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date?: string
          status?: string | null
          target_audience?: string[] | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      training_registrations: {
        Row: {
          attended: boolean | null
          contact_phone: string
          experience_level: string | null
          feedback_comments: string | null
          feedback_rating: number | null
          id: string
          organization: string | null
          participant_name: string
          registered_at: string
          registration_status: string | null
          specific_interests: string | null
          training_id: string
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          contact_phone: string
          experience_level?: string | null
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          organization?: string | null
          participant_name: string
          registered_at?: string
          registration_status?: string | null
          specific_interests?: string | null
          training_id: string
          user_id: string
        }
        Update: {
          attended?: boolean | null
          contact_phone?: string
          experience_level?: string | null
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          organization?: string | null
          participant_name?: string
          registered_at?: string
          registration_status?: string | null
          specific_interests?: string | null
          training_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_registrations_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "training_events"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_requests: {
        Row: {
          actual_price: number | null
          cargo_type: string
          contact_phone: string
          created_at: string
          dropoff_county: string
          dropoff_location: string
          estimated_value: number | null
          flexible_timing: boolean | null
          id: string
          insurance_required: boolean | null
          notes: string | null
          pickup_county: string
          pickup_location: string
          quantity: number
          quoted_price: number | null
          requested_date: string
          requester_id: string | null
          special_requirements: string[] | null
          status: string | null
          transporter_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          actual_price?: number | null
          cargo_type: string
          contact_phone: string
          created_at?: string
          dropoff_county: string
          dropoff_location: string
          estimated_value?: number | null
          flexible_timing?: boolean | null
          id?: string
          insurance_required?: boolean | null
          notes?: string | null
          pickup_county: string
          pickup_location: string
          quantity: number
          quoted_price?: number | null
          requested_date: string
          requester_id?: string | null
          special_requirements?: string[] | null
          status?: string | null
          transporter_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          actual_price?: number | null
          cargo_type?: string
          contact_phone?: string
          created_at?: string
          dropoff_county?: string
          dropoff_location?: string
          estimated_value?: number | null
          flexible_timing?: boolean | null
          id?: string
          insurance_required?: boolean | null
          notes?: string | null
          pickup_county?: string
          pickup_location?: string
          quantity?: number
          quoted_price?: number | null
          requested_date?: string
          requester_id?: string | null
          special_requirements?: string[] | null
          status?: string | null
          transporter_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_requests_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "transporters"
            referencedColumns: ["id"]
          },
        ]
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
      warehouse_bookings: {
        Row: {
          contact_phone: string
          created_at: string
          end_date: string
          id: string
          notes: string | null
          payment_status: string | null
          produce_type: string
          quantity_tons: number
          special_requirements: string[] | null
          start_date: string
          status: string | null
          total_cost: number
          updated_at: string
          user_id: string | null
          warehouse_id: string | null
        }
        Insert: {
          contact_phone: string
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          produce_type: string
          quantity_tons: number
          special_requirements?: string[] | null
          start_date: string
          status?: string | null
          total_cost: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Update: {
          contact_phone?: string
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          produce_type?: string
          quantity_tons?: number
          special_requirements?: string[] | null
          start_date?: string
          status?: string | null
          total_cost?: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
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
          availability_status: string | null
          capacity_tons: number
          certifications: string[] | null
          contact_info: string
          county: string
          created_at: string
          daily_rate_per_ton: number
          has_refrigeration: boolean | null
          has_security: boolean | null
          id: string
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          operating_hours: string | null
          owner_id: string | null
          storage_types: string[] | null
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          capacity_tons: number
          certifications?: string[] | null
          contact_info: string
          county: string
          created_at?: string
          daily_rate_per_ton: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          operating_hours?: string | null
          owner_id?: string | null
          storage_types?: string[] | null
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          capacity_tons?: number
          certifications?: string[] | null
          contact_info?: string
          county?: string
          created_at?: string
          daily_rate_per_ton?: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          owner_id?: string | null
          storage_types?: string[] | null
          updated_at?: string
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
      weather_data: {
        Row: {
          county: string
          created_at: string
          date: string
          forecast_data: Json | null
          humidity: number | null
          id: string
          rainfall: number | null
          source: string | null
          temperature_max: number | null
          temperature_min: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          county: string
          created_at?: string
          date: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          rainfall?: number | null
          source?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          county?: string
          created_at?: string
          date?: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          rainfall?: number | null
          source?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
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

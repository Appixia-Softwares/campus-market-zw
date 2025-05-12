export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          university: string | null
          university_id: string | null
          country_id: string | null
          city_id: string | null
          student_id: string | null
          phone: string | null
          is_verified: boolean
          verification_document: string | null
          created_at: string
          updated_at: string
          role: string
          preferred_currency_id: string | null
          preferred_language_id: string | null
          timezone: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          university_id?: string | null
          country_id?: string | null
          city_id?: string | null
          student_id?: string | null
          phone?: string | null
          is_verified?: boolean
          verification_document?: string | null
          created_at?: string
          updated_at?: string
          role?: string
          preferred_currency_id?: string | null
          preferred_language_id?: string | null
          timezone?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          university_id?: string | null
          country_id?: string | null
          city_id?: string | null
          student_id?: string | null
          phone?: string | null
          is_verified?: boolean
          verification_document?: string | null
          created_at?: string
          updated_at?: string
          role?: string
          preferred_currency_id?: string | null
          preferred_language_id?: string | null
          timezone?: string | null
        }
      }
      marketplace_listings: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          condition: string
          category: string
          location: string
          user_id: string
          status: string
          created_at: string
          updated_at: string
          country_id: string | null
          city_id: string | null
          university_id: string | null
          currency_id: string | null
          language_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          condition: string
          category: string
          location: string
          user_id: string
          status?: string
          created_at?: string
          updated_at?: string
          country_id?: string | null
          city_id?: string | null
          university_id?: string | null
          currency_id?: string | null
          language_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          condition?: string
          category?: string
          location?: string
          user_id?: string
          status?: string
          created_at?: string
          updated_at?: string
          country_id?: string | null
          city_id?: string | null
          university_id?: string | null
          currency_id?: string | null
          language_id?: string | null
        }
      }
      marketplace_images: {
        Row: {
          id: string
          listing_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          image_url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          image_url?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      accommodation_listings: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          type: string
          location: string
          user_id: string
          is_verified: boolean
          availability_date: string | null
          status: string
          created_at: string
          updated_at: string
          views: number | null
          country_id: string | null
          city_id: string | null
          university_id: string | null
          currency_id: string | null
          language_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          type: string
          location: string
          user_id: string
          is_verified?: boolean
          availability_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          views?: number | null
          country_id?: string | null
          city_id?: string | null
          university_id?: string | null
          currency_id?: string | null
          language_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          type?: string
          location?: string
          user_id?: string
          is_verified?: boolean
          availability_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          views?: number | null
          country_id?: string | null
          city_id?: string | null
          university_id?: string | null
          currency_id?: string | null
          language_id?: string | null
        }
      }
      accommodation_images: {
        Row: {
          id: string
          listing_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          image_url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          image_url?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      accommodation_amenities: {
        Row: {
          id: string
          listing_id: string
          amenity: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          amenity: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          amenity?: string
          created_at?: string
        }
      }
      accommodation_rules: {
        Row: {
          id: string
          listing_id: string
          rule: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          rule: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          rule?: string
          created_at?: string
        }
      }
      accommodation_applications: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          status: string
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          listing_id: string | null
          listing_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          listing_id?: string | null
          listing_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          listing_id?: string | null
          listing_type?: string | null
          created_at?: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          item_id: string
          item_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          item_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          item_type?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_id: string | null
          item_id: string | null
          item_type: string | null
          reason: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_id?: string | null
          item_id?: string | null
          item_type?: string | null
          reason: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_id?: string | null
          item_id?: string | null
          item_type?: string | null
          reason?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          listing_id: string
          quantity: number
          total_price: number
          status: string
          meetup_location: string | null
          meetup_date: string | null
          meetup_time: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          seller_id: string
          listing_id: string
          quantity?: number
          total_price: number
          status?: string
          meetup_location?: string | null
          meetup_date?: string | null
          meetup_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          seller_id?: string
          listing_id?: string
          quantity?: number
          total_price?: number
          status?: string
          meetup_location?: string | null
          meetup_date?: string | null
          meetup_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      countries: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          country_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          country_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          country_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      universities: {
        Row: {
          id: string
          name: string
          city_id: string
          country_id: string
          website: string | null
          logo_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city_id: string
          country_id: string
          website?: string | null
          logo_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          city_id?: string
          country_id?: string
          website?: string | null
          logo_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      currencies: {
        Row: {
          id: string
          name: string
          code: string
          symbol: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          symbol: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          symbol?: string
          created_at?: string
          updated_at?: string
        }
      }
      languages: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_marketplace_listings: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          title: string
          description: string | null
          price: number
          condition: string
          category: string
          location: string
          user_id: string
          status: string
          created_at: string
          updated_at: string
          country_id: string | null
          city_id: string | null
          university_id: string | null
          currency_id: string | null
          language_id: string | null
        }[]
      }
      search_accommodation_listings: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          title: string
          description: string | null
          price: number
          type: string
          location: string
          user_id: string
          is_verified: boolean
          availability_date: string | null
          status: string
          created_at: string
          updated_at: string
          views: number | null
          country_id: string | null
          city_id: string | null
          university_id: string | null
          currency_id: string | null
          language_id: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type InsertTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type UpdateTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          university_id: string | null
          role: "user" | "admin"
          status: "active" | "pending" | "inactive"
          verified: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          university_id?: string | null
          role?: "user" | "admin"
          status?: "active" | "pending" | "inactive"
          verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          university_id?: string | null
          role?: "user" | "admin"
          status?: "active" | "pending" | "inactive"
          verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      universities: {
        Row: {
          id: string
          name: string
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      accommodations: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          location_id: string
          type_id: string
          owner_id: string
          status: "available" | "pending" | "occupied" | "maintenance"
          featured: boolean
          verified: boolean
          rating: number | null
          reviews_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          location_id: string
          type_id: string
          owner_id: string
          status?: "available" | "pending" | "occupied" | "maintenance"
          featured?: boolean
          verified?: boolean
          rating?: number | null
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          location_id?: string
          type_id?: string
          owner_id?: string
          status?: "available" | "pending" | "occupied" | "maintenance"
          featured?: boolean
          verified?: boolean
          rating?: number | null
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          category_id: string
          condition: "New" | "Like New" | "Good" | "Fair" | "Poor"
          seller_id: string
          status: "active" | "pending" | "sold" | "removed"
          featured: boolean
          verified: boolean
          views: number
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          category_id: string
          condition: "New" | "Like New" | "Good" | "Fair" | "Poor"
          seller_id: string
          status?: "active" | "pending" | "sold" | "removed"
          featured?: boolean
          verified?: boolean
          views?: number
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          category_id?: string
          condition?: "New" | "Like New" | "Good" | "Fair" | "Poor"
          seller_id?: string
          status?: "active" | "pending" | "sold" | "removed"
          featured?: boolean
          verified?: boolean
          views?: number
          likes?: number
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          city: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          city?: string
          created_at?: string
          updated_at?: string
        }
      }
      accommodation_types: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      amenities: {
        Row: {
          id: string
          name: string
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accommodation_images: {
        Row: {
          id: string
          accommodation_id: string
          url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          accommodation_id: string
          url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          accommodation_id?: string
          url?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          rating: number
          comment: string | null
          reviewable_type: "product" | "accommodation"
          reviewable_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rating: number
          comment?: string | null
          reviewable_type: "product" | "accommodation"
          reviewable_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          reviewable_type?: "product" | "accommodation"
          reviewable_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          saveable_type: "product" | "accommodation"
          saveable_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          saveable_type: "product" | "accommodation"
          saveable_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          saveable_type?: "product" | "accommodation"
          saveable_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_product_views: {
        Args: {
          product_id: string
        }
        Returns: undefined
      }
      toggle_product_like: {
        Args: {
          product_id: string
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "user" | "admin"
      user_status: "active" | "pending" | "inactive"
      accommodation_status: "available" | "pending" | "occupied" | "maintenance"
      product_status: "active" | "pending" | "sold" | "removed"
      product_condition: "New" | "Like New" | "Good" | "Fair" | "Poor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

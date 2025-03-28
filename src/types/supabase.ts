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
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      browsing_history: {
        Row: {
          id: string
          property_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "browsing_history_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      furniture: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          price: string
          price_numeric: number | null
          rating: number | null
          reviews: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          price: string
          price_numeric?: number | null
          rating?: number | null
          reviews?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          price?: string
          price_numeric?: number | null
          rating?: number | null
          reviews?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      furniture_browsing_history: {
        Row: {
          furniture_id: string
          id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          furniture_id: string
          id?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          furniture_id?: string
          id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_furniture_browsing_history_furniture"
            columns: ["furniture_id"]
            isOneToOne: false
            referencedRelation: "furniture"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string | null
          id: string
          notes: string | null
          provider_id: string | null
          service_type: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string | null
          id?: string
          notes?: string | null
          provider_id?: string | null
          service_type: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          provider_id?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      maintenance_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      maintenance_providers: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string
          price: string | null
          rating: number | null
          reviews: number | null
          specialty: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          name: string
          price?: string | null
          rating?: number | null
          reviews?: number | null
          specialty?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: string | null
          rating?: number | null
          reviews?: number | null
          specialty?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          area: string
          baths: number
          beds: number
          created_at: string | null
          features: string[] | null
          id: string
          image: string
          location: string
          price: string
          price_numeric: number | null
          property_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          area: string
          baths: number
          beds: number
          created_at?: string | null
          features?: string[] | null
          id?: string
          image: string
          location: string
          price: string
          price_numeric?: number | null
          property_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          area?: string
          baths?: number
          beds?: number
          created_at?: string | null
          features?: string[] | null
          id?: string
          image?: string
          location?: string
          price?: string
          price_numeric?: number | null
          property_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_properties: {
        Row: {
          id: string
          property_id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          property_id: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          property_id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string | null
          features: string[] | null
          id: string
          language: string
          location: string | null
          price_range: string | null
          property_type: string | null
          query: string
          search_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          language?: string
          location?: string | null
          price_range?: string | null
          property_type?: string | null
          query: string
          search_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          language?: string
          location?: string | null
          price_range?: string | null
          property_type?: string | null
          query?: string
          search_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          max_price: number | null
          min_baths: number | null
          min_beds: number | null
          min_price: number | null
          preferred_locations: string[] | null
          preferred_property_types: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_price?: number | null
          min_baths?: number | null
          min_beds?: number | null
          min_price?: number | null
          preferred_locations?: string[] | null
          preferred_property_types?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_price?: number | null
          min_baths?: number | null
          min_beds?: number | null
          min_price?: number | null
          preferred_locations?: string[] | null
          preferred_property_types?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          is_admin: boolean | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          is_admin?: boolean | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          is_admin?: boolean | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_personalized_recommendations: {
        Args: {
          p_user_id: string
          p_limit?: number
        }
        Returns: {
          property_id: string
          relevance_score: number
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

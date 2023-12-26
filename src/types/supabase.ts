export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      event: {
        Row: {
          created_at: string
          event_date: string
          gift_amount: number
          id: string
          message: string
          notification_mode: string
          rules: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_date: string
          gift_amount: number
          id?: string
          message: string
          notification_mode: string
          rules?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_date?: string
          gift_amount?: number
          id?: string
          message?: string
          notification_mode?: string
          rules?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pairing: {
        Row: {
          created_at: string
          event_id: string
          giver_id: string
          id: string
          password: string | null
          receiver_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          giver_id: string
          id?: string
          password?: string | null
          receiver_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          giver_id?: string
          id?: string
          password?: string | null
          receiver_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pairing_event_id_event_id_fk"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pairing_giver_id_person_id_fk"
            columns: ["giver_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pairing_receiver_id_person_id_fk"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          }
        ]
      }
      person: {
        Row: {
          allow_exclusion: number
          created_at: string
          id: string
          name: string
          phone_number: string | null
          push_subscribed: boolean
          updated_at: string
        }
        Insert: {
          allow_exclusion?: number
          created_at?: string
          id?: string
          name: string
          phone_number?: string | null
          push_subscribed?: boolean
          updated_at?: string
        }
        Update: {
          allow_exclusion?: number
          created_at?: string
          id?: string
          name?: string
          phone_number?: string | null
          push_subscribed?: boolean
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

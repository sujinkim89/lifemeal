export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          gender: string | null
          age: number | null
          height: number | null
          weight: number | null
          activity_level: string | null
          health_checkup: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          gender?: string | null
          age?: number | null
          height?: number | null
          weight?: number | null
          activity_level?: string | null
          health_checkup?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          gender?: string | null
          age?: number | null
          height?: number | null
          weight?: number | null
          activity_level?: string | null
          health_checkup?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_records: {
        Row: {
          id: string
          user_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          foods: string[]
          image_url: string | null
          calories: number | null
          nutrients: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          foods: string[]
          image_url?: string | null
          calories?: number | null
          nutrients?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          foods?: string[]
          image_url?: string | null
          calories?: number | null
          nutrients?: any | null
          created_at?: string
        }
      }
      nutrition_analysis: {
        Row: {
          id: string
          user_id: string
          analysis_date: string
          nutrients: any
          deficiencies: string[]
          recommendations: string[]
          balance_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          analysis_date: string
          nutrients: any
          deficiencies: string[]
          recommendations: string[]
          balance_score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          analysis_date?: string
          nutrients?: any
          deficiencies?: string[]
          recommendations?: string[]
          balance_score?: number
          created_at?: string
        }
      }
      coaching_messages: {
        Row: {
          id: string
          user_id: string
          type: 'user' | 'coach' | 'system'
          content: string
          coach_type: string | null
          meal_data: any | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'user' | 'coach' | 'system'
          content: string
          coach_type?: string | null
          meal_data?: any | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'user' | 'coach' | 'system'
          content?: string
          coach_type?: string | null
          meal_data?: any | null
          image_url?: string | null
          created_at?: string
        }
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
  }
}
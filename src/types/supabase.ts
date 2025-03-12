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
      movies: {
        Row: {
          id: number
          title: string
          description: string
          thumbnail_url: string
          release_year: number
          genre: string[]
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          thumbnail_url: string
          release_year: number
          genre?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          thumbnail_url?: string
          release_year?: number
          genre?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          display_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_ratings: {
        Row: {
          id: number
          user_id: string
          movie_id: number
          rating: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          user_id: string
          movie_id: number
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          movie_id?: number
          rating?: number
          created_at?: string
          updated_at?: string
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

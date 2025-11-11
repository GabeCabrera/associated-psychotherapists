/**
 * Database Type Definitions
 * 
 * TypeScript types for Supabase database schema.
 * These types should be kept in sync with the database schema.
 * 
 * Auto-generation:
 * Run `supabase gen types typescript --local` to generate types from your schema.
 * 
 * @see https://supabase.com/docs/guides/api/generating-types
 */

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
      profiles: {
        Row: {
          id: string
          role: 'therapist' | 'client' | 'admin'
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          deleted_at: string | null
        }
        Insert: {
          id: string
          role: 'therapist' | 'client' | 'admin'
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          deleted_at?: string | null
        }
        Update: {
          id?: string
          role?: 'therapist' | 'client' | 'admin'
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          deleted_at?: string | null
        }
      }
      therapist_profiles: {
        Row: {
          id: string
          user_id: string
          license_number: string
          license_state: string
          license_verified: boolean
          verification_status: 'pending' | 'verified' | 'rejected'
          verification_notes: string | null
          specializations: string[]
          bio: string | null
          years_experience: number | null
          education: string | null
          approach: string | null
          rate_per_session: number | null
          accepts_insurance: boolean
          insurance_providers: string[] | null
          availability_json: Json | null
          timezone: string
          is_accepting_clients: boolean
          video_intro_url: string | null
          website_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          license_number: string
          license_state: string
          license_verified?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          verification_notes?: string | null
          specializations?: string[]
          bio?: string | null
          years_experience?: number | null
          education?: string | null
          approach?: string | null
          rate_per_session?: number | null
          accepts_insurance?: boolean
          insurance_providers?: string[] | null
          availability_json?: Json | null
          timezone?: string
          is_accepting_clients?: boolean
          video_intro_url?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          license_number?: string
          license_state?: string
          license_verified?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          verification_notes?: string | null
          specializations?: string[]
          bio?: string | null
          years_experience?: number | null
          education?: string | null
          approach?: string | null
          rate_per_session?: number | null
          accepts_insurance?: boolean
          insurance_providers?: string[] | null
          availability_json?: Json | null
          timezone?: string
          is_accepting_clients?: boolean
          video_intro_url?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      client_profiles: {
        Row: {
          id: string
          user_id: string
          date_of_birth: string | null
          gender: string | null
          preferred_pronouns: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          insurance_provider: string | null
          insurance_member_id: string | null
          goals: string | null
          previous_therapy: boolean | null
          preferred_communication: 'video' | 'phone' | 'chat' | 'in-person'
          timezone: string
          intake_completed: boolean
          intake_completed_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date_of_birth?: string | null
          gender?: string | null
          preferred_pronouns?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          insurance_provider?: string | null
          insurance_member_id?: string | null
          goals?: string | null
          previous_therapy?: boolean | null
          preferred_communication?: 'video' | 'phone' | 'chat' | 'in-person'
          timezone?: string
          intake_completed?: boolean
          intake_completed_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date_of_birth?: string | null
          gender?: string | null
          preferred_pronouns?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          insurance_provider?: string | null
          insurance_member_id?: string | null
          goals?: string | null
          previous_therapy?: boolean | null
          preferred_communication?: 'video' | 'phone' | 'chat' | 'in-person'
          timezone?: string
          intake_completed?: boolean
          intake_completed_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          therapist_id: string
          client_id: string
          scheduled_at: string
          duration_minutes: number
          session_type: 'video' | 'phone' | 'in-person'
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
          meeting_url: string | null
          notes_therapist: string | null
          notes_client: string | null
          amount_charged: number | null
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
          stripe_payment_intent_id: string | null
          cancellation_reason: string | null
          cancelled_by: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          therapist_id: string
          client_id: string
          scheduled_at: string
          duration_minutes?: number
          session_type?: 'video' | 'phone' | 'in-person'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
          meeting_url?: string | null
          notes_therapist?: string | null
          notes_client?: string | null
          amount_charged?: number | null
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          stripe_payment_intent_id?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          therapist_id?: string
          client_id?: string
          scheduled_at?: string
          duration_minutes?: number
          session_type?: 'video' | 'phone' | 'in-person'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
          meeting_url?: string | null
          notes_therapist?: string | null
          notes_client?: string | null
          amount_charged?: number | null
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          stripe_payment_intent_id?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          read_at: string | null
          edited_at: string | null
          deleted_by_sender: boolean
          deleted_by_recipient: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          read_at?: string | null
          edited_at?: string | null
          deleted_by_sender?: boolean
          deleted_by_recipient?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read_at?: string | null
          edited_at?: string | null
          deleted_by_sender?: boolean
          deleted_by_recipient?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type TherapistProfile = Database['public']['Tables']['therapist_profiles']['Row']
export type ClientProfile = Database['public']['Tables']['client_profiles']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type TherapistProfileInsert = Database['public']['Tables']['therapist_profiles']['Insert']
export type ClientProfileInsert = Database['public']['Tables']['client_profiles']['Insert']
export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type TherapistProfileUpdate = Database['public']['Tables']['therapist_profiles']['Update']
export type ClientProfileUpdate = Database['public']['Tables']['client_profiles']['Update']
export type SessionUpdate = Database['public']['Tables']['sessions']['Update']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']

// User role type
export type UserRole = Database['public']['Tables']['profiles']['Row']['role']

// Verification status type
export type VerificationStatus = Database['public']['Tables']['therapist_profiles']['Row']['verification_status']

// Communication preference type
export type CommunicationPreference = Database['public']['Tables']['client_profiles']['Row']['preferred_communication']

// Session types
export type SessionType = Database['public']['Tables']['sessions']['Row']['session_type']
export type SessionStatus = Database['public']['Tables']['sessions']['Row']['status']
export type PaymentStatus = Database['public']['Tables']['sessions']['Row']['payment_status']

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          user_type: 'customer' | 'provider';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: string;
          breed: string | null;
          age: number | null;
          weight: number | null;
          photo_url: string | null;
          medical_notes: string | null;
          created_at: string;
        };
      };
      providers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          description: string | null;
          logo_url: string | null;
          rating: number;
          total_reviews: number;
          verified: boolean;
          ong_alliance: boolean;
          ong_details: any;
          latitude: number | null;
          longitude: number | null;
          address: string | null;
          delivery_available: boolean;
          delivery_zones: any;
          created_at: string;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          category: string;
          name: string;
          description: string | null;
          price: number;
          duration_minutes: number | null;
          species_allowed: string[];
          photos: string[];
          active: boolean;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          provider_id: string;
          category: string;
          name: string;
          description: string | null;
          price: number;
          discount_percentage: number;
          stock: number;
          photos: string[];
          trending: boolean;
          featured: boolean;
          species: string[];
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          provider_id: string;
          booking_type: 'service' | 'product';
          service_id: string | null;
          product_id: string | null;
          pet_id: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          scheduled_date: string | null;
          total_amount: number;
          kunapuntos_used: number;
          payment_status: string;
          delivery_address: string | null;
          notes: string | null;
          created_at: string;
        };
      };
      kunapuntos: {
        Row: {
          id: string;
          user_id: string;
          points: number;
          transaction_type: 'earned' | 'redeemed' | 'bonus';
          booking_id: string | null;
          description: string;
          created_at: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'free' | 'monthly' | 'annual';
          status: 'active' | 'cancelled' | 'expired';
          start_date: string;
          end_date: string | null;
          auto_renew: boolean;
          created_at: string;
        };
      };
    };
  };
}

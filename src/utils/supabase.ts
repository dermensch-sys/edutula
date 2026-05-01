import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
    dailyGoal: number;
  };
  profile: {
    level: string;
    interests: string[];
    goals: string[];
    studyTime: number;
  };
  is_admin?: boolean;
  last_login?: string | null;
}

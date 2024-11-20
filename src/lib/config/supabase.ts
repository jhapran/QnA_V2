import { createClient } from '@supabase/supabase-js';

// Validate Supabase URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Create client only if URL is valid
export const supabase = supabaseUrl && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey || '')
  : null;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) && 
  supabase
);
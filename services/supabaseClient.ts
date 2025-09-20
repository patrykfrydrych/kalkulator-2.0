import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpdgypmwfacxaeiknfaz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZGd5cG13ZmFjeGFlaWtuZmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODExMjMsImV4cCI6MjA3Mzk1NzEyM30.kI7_u40zsKzjfZ5_dOgCHPHjfda93UMDO7--n8-gvOI';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

import { TypedSupabaseClient } from "@/types";

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<TypedSupabaseClient>(supabaseUrl, supabaseAnonKey);

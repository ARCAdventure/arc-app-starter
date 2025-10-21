import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const SUPABASE_URL = process.env.SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

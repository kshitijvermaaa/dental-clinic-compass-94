// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ebqaeyscscaxqxywcnpa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicWFleXNjc2NheHF4eXdjbnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Mjk2OTQsImV4cCI6MjA2NTEwNTY5NH0.LbxboQffWdiJYtyHBcT-LWVlx8qz9O4nyw3y382xLg4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
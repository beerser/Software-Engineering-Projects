import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://atatyagqzkjmtezdyolk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YXR5YWdxemtqbXRlemR5b2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMDYwNTQsImV4cCI6MjA1NDg4MjA1NH0.g37HhjyCqawvirU7YXVwSmssEy1JHFTv0c1ctT3ahfg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


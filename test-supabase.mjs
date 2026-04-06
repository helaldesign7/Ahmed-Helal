
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing Supabase Connection...");
  console.log("URL:", supabaseUrl);
  
  try {
    const { data: projects, error: projectsError } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    if (projectsError) {
      console.error("Error fetching projects count:", projectsError.message);
    } else {
      console.log("Projects table exists. Count:", projectsCount);
    }

    const { data: leads, error: leadsError } = await supabase.from('leads').select('count', { count: 'exact', head: true });
    if (leadsError) {
      console.error("Error fetching leads count:", leadsError.message);
    } else {
      console.log("Leads table exists. Count:", leadsCount);
    }

    const { data: settings, error: settingsError } = await supabase.from('site_settings').select('id').eq('id', 'global').single();
    if (settingsError) {
      console.error("Error fetching site_settings:", settingsError.message);
    } else {
      console.log("site_settings table exists and global row found.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

testConnection();

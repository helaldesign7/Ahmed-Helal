import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkSchema() {
  const { data, error } = await supabase.from('leads').select('*').limit(1);
  if (error) {
    console.error('Error fetching leads:', error);
  } else {
    console.log('Available columns in leads:', Object.keys(data[0] || {}));
  }
}

checkSchema();

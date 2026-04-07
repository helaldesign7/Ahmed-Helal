import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const res = await fetch(`${VITE_SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
    }
  });
  const data = await res.text();
  fs.writeFileSync('schema.json', data);
}
run();

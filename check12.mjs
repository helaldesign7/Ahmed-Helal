import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const res = await fetch(`${VITE_SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
      'Accept': 'application/openapi+json'
    }
  });
  const data = await res.json();
  const leadsInfo = data.definitions ? data.definitions.leads : (data.components ? data.components.schemas.leads : null);
  if (leadsInfo) {
    console.log('Columns:', Object.keys(leadsInfo.properties));
  } else {
    console.log('No leads table in schema.');
  }
}
run();

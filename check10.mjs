import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const payload = {
    name: "T", email: "t@t.com", whatsapp: "1", company: "c", interest: "i",
    serviceType: "s", projectTitle: "p", description: "d", budget: "b", timeline: "t",
    preferredContact: "p", status: "new", date: new Date().toISOString(), source: "s"
  };
  const res = await fetch(`${VITE_SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'apikey': VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });
  console.log('Status:', res.status);
  console.log('Response:', await res.text());
}
run();

const url = process.env.VITE_SUPABASE_URL || 'https://hybkonskqkwdcptjjmwx.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function check() {
  const req = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      serviceType: 'test',
      projectTitle: 'test'
    })
  });
  console.log(req.status, await req.text());
}
check();

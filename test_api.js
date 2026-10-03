const http = require('http');

async function test() {
  console.log('--- Testing POST /api/register ---');
  const payload = JSON.stringify({
    full_name: 'Lê Minh Trí',
    phone: '0987654321',
    email: 'tri.le@example.com',
    company: 'Công ty Đầu Tư Trí Việt · CEO',
    ticket: 'VVIP',
    attendees: '2',
    consent: true
  });

  const req = http.request('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Register Response:', JSON.parse(data));
      
      console.log('\n--- Testing GET /api/leads with password ---');
      http.get('http://localhost:3000/api/leads', {
        headers: { 'x-admin-password': 'astronixa2026' }
      }, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          const leads = JSON.parse(data2);
          console.log(`Success! Total leads: ${leads.leads.length}`);
          console.log('First lead:', leads.leads[0].full_name, 'Hạng:', leads.leads[0].ticket);
        });
      });
    });
  });

  req.write(payload);
  req.end();
}

test();

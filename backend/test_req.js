const jwt = require('jsonwebtoken');
const http = require('http');
require('dotenv').config();

const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET || 'fallback_secret');

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/skill-gap/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.write(JSON.stringify({ target_role: 'Software Engineer', current_skills: 'python, java, c++, c, R programming' }));
req.end();

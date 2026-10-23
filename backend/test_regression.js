// Regression Test Suite for CareerNavigator API
const express = require('express');
const request = require('http');

// Load built application or src
const app = require('./dist/server.js').default;

const PORT = 5099;
let server;

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = request.request(options, (res) => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting CareerNavigator Regression Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Health check
  console.log('Test Group 1: Health Check');
  const healthRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  assert(healthRes.status === 200 && healthRes.data?.status === 'ok', 'GET /api/health returns 200 ok');

  // 2. Register User 1
  console.log('\nTest Group 2: User Registration & Token Generation');
  const testEmail1 = `user1_${Date.now()}@test.com`;
  const regRes1 = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { name: 'Alice Walker', email: testEmail1, password: 'password123' });

  assert(regRes1.status === 201, 'User 1 registered with HTTP 201');
  assert(regRes1.data?.user?.id !== undefined, 'User 1 object contains id: ' + regRes1.data?.user?.id);
  assert(typeof regRes1.data?.token === 'string', 'User 1 registration returns a valid JWT token');

  const token1 = regRes1.data?.token;
  const user1Id = regRes1.data?.user?.id;

  // 3. Register User 2
  const testEmail2 = `user2_${Date.now()}@test.com`;
  const regRes2 = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { name: 'Bob Smith', email: testEmail2, password: 'password123' });

  const token2 = regRes2.data?.token;
  const user2Id = regRes2.data?.user?.id;
  assert(regRes2.status === 201 && user2Id !== user1Id, 'User 2 registered with unique id: ' + user2Id);

  // 4. Login User 1
  console.log('\nTest Group 3: User Authentication');
  const loginRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: testEmail1, password: 'password123' });

  assert(loginRes.status === 200, 'User 1 logged in with HTTP 200');
  assert(loginRes.data?.user?.id === user1Id, 'Login returns matching user ID');
  assert(typeof loginRes.data?.token === 'string', 'Login returns valid token');

  // 5. Get Profile
  console.log('\nTest Group 4: Profile Retrieval');
  const getProfRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token1}` }
  });
  assert(getProfRes.status === 200, 'GET /api/profile returns 200 for authenticated user');
  assert(getProfRes.data?.email === testEmail1, 'Profile email matches User 1');

  // 6. Update Profile with full fields
  console.log('\nTest Group 5: Full Profile Update');
  const fullUpdatePayload = {
    name: 'Alice Walker Updated',
    phone: '+91 9876543210',
    location: 'Vadodara, India',
    bio: 'Software engineer passionate about AI',
    skills: 'Node.js, Python, SQL, TypeScript',
    experience: 'Software Intern at Tech Corp',
    education: 'B.Tech in Computer Engineering',
    certifications: 'AWS Certified Cloud Practitioner',
    linkedin_url: 'https://linkedin.com/in/alicewalker',
    github_url: 'https://github.com/alicewalker',
    portfolio_url: 'https://alicewalker.dev'
  };

  const updateRes1 = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    }
  }, fullUpdatePayload);

  assert(updateRes1.status === 200, 'PUT /api/profile with full fields returns 200 OK');
  assert(updateRes1.data?.phone === '+91 9876543210', 'Phone was successfully updated');
  assert(updateRes1.data?.location === 'Vadodara, India', 'Location was successfully updated');
  assert(updateRes1.data?.completion > 0, 'Profile completion calculated: ' + updateRes1.data?.completion + '%');

  // 7. Verify partial update doesn't overwrite existing fields
  console.log('\nTest Group 6: Partial Profile Update (Onboarding / Isolated Fields)');
  const partialUpdatePayload = {
    college: 'MS University of Baroda',
    current_year: '4th Year',
    career_goal: 'Full Stack Engineer'
  };

  const updateRes2 = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    }
  }, partialUpdatePayload);

  assert(updateRes2.status === 200, 'Partial PUT /api/profile returns 200 OK');

  // Re-fetch profile to verify both sets of fields exist
  const verifyRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token1}` }
  });

  assert(verifyRes.data?.college === 'MS University of Baroda', 'Partial field college preserved');
  assert(verifyRes.data?.phone === '+91 9876543210', 'Previously saved phone was NOT overwritten by partial update');
  assert(verifyRes.data?.location === 'Vadodara, India', 'Previously saved location was NOT overwritten by partial update');

  // 8. Test saving with missing/optional fields (nulls, empty strings, undefined payload)
  console.log('\nTest Group 7: Safe Handling of Missing / Optional Fields');
  const safePayload = {
    phone: '9616',
    location: 'vadodara',
    bio: 'rticipant \n 2026 \n eted my internship',
    skills: 'Node.js, Python, SQL',
    linkedin_url: '',
    github_url: '',
    portfolio_url: ''
  };

  const safeRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    }
  }, safePayload);

  assert(safeRes.status === 200, 'Profile saved cleanly without undefined binding error');

  // 9. User Isolation - User 2 profile is distinct and unaffected
  console.log('\nTest Group 8: User Isolation & Security');
  const user2ProfRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token2}` }
  });

  assert(user2ProfRes.status === 200, 'User 2 profile fetched successfully');
  assert(user2ProfRes.data?.phone !== '+91 9876543210', "User 2 profile does not have User 1's phone");

  // 10. Unauthorized requests
  console.log('\nTest Group 9: Unauthorized & Malformed Requests');
  const noTokenRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, { phone: '123' });
  assert(noTokenRes.status === 401, 'Request without token is rejected with 401 Unauthorized');

  const invalidTokenRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid.jwt.token'
    }
  }, { phone: '123' });
  assert(invalidTokenRes.status === 401, 'Request with invalid token is rejected with 401 Unauthorized');

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  process.exit(failed === 0 ? 0 : 1);
}

// Start server if not running or run against current server
const testReq = request.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/health',
  method: 'GET'
}, (res) => {
  runTests();
});

testReq.on('error', () => {
  // Start server on port 5000
  const server = app.listen(5000, '0.0.0.0', () => {
    console.log('Test server started on port 5000');
    runTests();
  });
});
testReq.end();

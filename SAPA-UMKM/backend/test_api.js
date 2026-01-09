const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api';

async function testHistory() {
    try {
        console.log('1. Attempting login as pelakuumkm@gmail.com...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'pelakuumkm@gmail.com', password: 'password123' })
        });

        const loginData = await loginRes.json();
        if (!loginData.success) {
            console.error('Login failed:', loginData.message);
            // Try alternative password if needed, but assuming it matches. 
            // The auth.js uses bcrypt, so it depends on what was in users table.
            console.log('Trying to find user in DB to verify password...');
            return;
        }

        const token = loginData.data.token;
        console.log('2. Login successful. Fetching history...');

        const historyRes = await fetch(`${API_URL}/submissions/my-history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const historyData = await historyRes.json();
        console.log('3. History Response:', JSON.stringify(historyData, null, 2));

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testHistory();

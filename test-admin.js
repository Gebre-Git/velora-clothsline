// Test script to verify admin authentication and database integration
const testEndpoints = async () => {
    console.log('=== Testing Admin Authentication and Database Integration ===\n');

    // Test 1: Login with correct password
    console.log('Test 1: Login with correct password');
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'gebre2024mail@gmail.com',
                password: 'cxXGxyNdNdxeD5ms'
            })
        });
        const data = await response.json();
        console.log('✅ Status:', response.status);
        console.log('✅ Response:', data);
        console.log('✅ Token received:', !!data.token);
        console.log('✅ Email returned:', data.email);
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    // Test 2: Login with wrong password
    console.log('\nTest 2: Login with wrong password');
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'gebre2024mail@gmail.com',
                password: 'wrongpassword'
            })
        });
        const data = await response.json();
        console.log('✅ Status:', response.status);
        console.log('✅ Response:', data);
        console.log('✅ Should be 401:', response.status === 401);
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    // Test 3: Fetch orders from database
    console.log('\nTest 3: Fetch orders from database');
    try {
        const response = await fetch('http://localhost:5000/api/orders');
        const data = await response.json();
        console.log('✅ Status:', response.status);
        console.log('✅ Orders count:', data.length);
        console.log('✅ Sample order:', data[0]);
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    // Test 4: Fetch reviews from database
    console.log('\nTest 4: Fetch reviews from database');
    try {
        const response = await fetch('http://localhost:5000/api/reviews');
        const data = await response.json();
        console.log('✅ Status:', response.status);
        console.log('✅ Reviews count:', data.length);
        console.log('✅ Sample review:', data[0]);
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    console.log('\n=== All tests completed ===');
};

testEndpoints();

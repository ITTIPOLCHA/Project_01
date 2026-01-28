async function testLogin() {
    try {
        console.log('Attempting login with: nodetest_filtered@example.com / password123');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'nodetest_filtered@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login Success:', data);
        } else {
            console.error('Login Failed:', response.status, data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();

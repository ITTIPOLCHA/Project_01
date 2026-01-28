async function testRegister() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'nodeTestUserFiltered',
                email: 'nodetest_filtered@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Registration Success:', data);
        } else {
            console.error('Registration Failed:', response.status, data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRegister();

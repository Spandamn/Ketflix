// Check if the user is already logged in
const existingSessionKey = sessionStorage.getItem('sessionKey');
if (existingSessionKey) {
    // Redirect to catalog page
    window.location.href = 'catalog.html';
} else {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const apiUrl = 'https://m5jgzxzvd4.execute-api.eu-west-2.amazonaws.com/Prod';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (data.message === 'Login successful!') {
                // Save the session key to sessionStorage
                sessionStorage.setItem('sessionKey', data.sessionKey);

                // Redirect to catalog page
                window.location.href = 'catalog.html';
            } else {
                alert('Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });
}

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Hardcoded API Gateway URL
    const apiUrl = 'https://m5jgzxzvd4.execute-api.eu-west-2.amazonaws.com/Prod';

    // Fetch register endpoint
    fetch(apiUrl + '/register', {
        method: 'POST',
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            fullName: document.getElementById('fullName').value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Registration successful!') {
            // Redirect to login page after successful registration
            window.location.href = 'index.html';
        } else {
            // Display error message
            alert('Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
    });
});

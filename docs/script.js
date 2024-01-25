const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Replace 'https://m5jgzxzvd4.execute-api.eu-west-2.amazonaws.com/Prod' with your actual backend API URL
    const apiUrl = 'https://m5jgzxzvd4.execute-api.eu-west-2.amazonaws.com/Prod';

    // Fetch login endpoint
    fetch(apiUrl + '/login', {
        method: 'POST',
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful!') {
            // Redirect to catalog page
            window.location.href = 'catalog.html';
        } else {
            // Display error message
            alert('Invalid email or password.');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
    });
});

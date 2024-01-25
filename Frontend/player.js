document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://m5jgzxzvd4.execute-api.eu-west-2.amazonaws.com/Prod';

    // Get movieid from the query parameters
    const params = new URLSearchParams(window.location.search);
    const movieid = params.get('movieid');

    // Fetch movie details and signed URL from the backend
    const response = await fetch(`${apiUrl}/player?movieid=${movieid}`);
    const responseObj = await response.json();
    console.log(responseObj);
    const { movie, signedUrl } = responseObj;

    // Set movie title and description
    const movieTitle = document.getElementById('movie-title');
    movieTitle.textContent = movie.title;

    const movieDescription = document.getElementById('movie-description');
    movieDescription.textContent = movie.description;

    // Set video source with the signed URL
    const moviePlayer = document.getElementById('movie-player');
    moviePlayer.src = signedUrl;

    // Add event listener for the logout button
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        // Remove the session key from sessionStorage
        sessionStorage.removeItem('sessionKey');
        // Redirect to login page
        window.location.href = 'login.html';
    });

    // Add event listener for the "Back to Catalog" button
    const backToCatalogButton = document.getElementById('back-to-catalog');
    backToCatalogButton.addEventListener('click', () => {
        // Redirect to catalog page
        window.location.href = 'catalog.html';
    });
});

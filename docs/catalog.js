document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://m5jgzxzvd4.execute-api.eu-west-2.amazonaws.com/Prod';

    // Check if the user is logged in
    const sessionKey = sessionStorage.getItem('sessionKey');

    if (!sessionKey) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Fetch movie catalog from the backend
    const response = await fetch(`${apiUrl}/catalog`, {
        headers: {
            'Authorization': sessionKey,
        },
    });

    if (!response.ok) {
        console.error('Failed to fetch catalog:', response);
        return;
    }

    const catalog = await response.json();
    console.log('Catalog:', catalog);

    // Display movies in the catalog by genre
    const catalogContainer = document.getElementById('catalog');

    // Create a map to group movies by genre
    const moviesByGenre = new Map();

    catalog.forEach(movie => {
        if (!moviesByGenre.has(movie.genre)) {
            moviesByGenre.set(movie.genre, []);
        }

        moviesByGenre.get(movie.genre).push(movie);
    });

    // Iterate through genres and display movies horizontally
    moviesByGenre.forEach((movies, genre) => {
        const genreContainer = createGenreContainer(genre);

        const moviesContainer = document.createElement('div');
        moviesContainer.classList.add('movies-container');

        movies.forEach(movie => {
            const movieElement = createMovieElement(movie);
            moviesContainer.appendChild(movieElement);
        });

        genreContainer.appendChild(moviesContainer);
        catalogContainer.appendChild(genreContainer);
    });

    // Add event listener for the logout button
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        // Remove the session key from sessionStorage
        sessionStorage.removeItem('sessionKey');
        // Redirect to login page
        window.location.href = 'login.html';
    });
});

function createGenreContainer(genre) {
    const genreContainer = document.createElement('div');
    genreContainer.classList.add('genre');

    const genreHeading = document.createElement('h2');
    genreHeading.textContent = genre;

    genreContainer.appendChild(genreHeading);

    return genreContainer;
}

function createMovieElement(movie) {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie');

    const thumbnail = document.createElement('img');
    thumbnail.src = movie.thumbnail;
    thumbnail.alt = movie.title;
    thumbnail.title = movie.title; // Set the title attribute for the tooltip
    thumbnail.classList.add('thumbnail'); // Add a class for styling

    const title = document.createElement('p');
    title.textContent = movie.title;

    // Add a click event to redirect to the player page when the movie is clicked
    movieContainer.addEventListener('click', () => {
        redirectToPlayerPage(movie.movieid);
    });

    movieContainer.appendChild(thumbnail);
    movieContainer.appendChild(title);

    return movieContainer;
}

function redirectToPlayerPage(movieid) {
    window.location.href = `player.html?movieid=${movieid}`;
}

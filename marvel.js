let ts = 1;
let publicKey = '44f2bf2a3d051c1958909730a209ff56';
let hashVal = 'd1ee0d38c5de0c0fd5d9592d12a3f01d';

// Display Iron Man characters when the page loads
searchSuperheroes();
showHomePage();

// Function to fetch and display superheroes
function searchSuperheroes() {
const searchQuery = document.getElementById('searchInput').value;
const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashVal}&nameStartsWith=${searchQuery}`;

// Fetch superheroes from the API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
    displaySuperheroes(data.data.results);
    })
    .catch(error => console.error('Error fetching superheroes:', error));
}

// Function to display superheroes on the home page
function displaySuperheroes(superheroes) {
const favoritesList = document.getElementById('favoritesList');
const superheroesList = document.getElementById('superheroesList');
const favoritesIds = Array.from(favoritesList.children).map(favorite => favorite.dataset.superheroId);

superheroesList.innerHTML = '';

superheroes.forEach(superhero => {
    const superheroCard = document.createElement('div');
    superheroCard.classList.add('superhero-card');
    const isFavorite = favoritesIds.includes(superhero.id.toString());

    superheroCard.innerHTML = `
    <h3>${superhero.name}</h3>
    <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
    <button onclick="toggleFavorites('${superhero.id}', '${superhero.name}', '${superhero.thumbnail.path}.${superhero.thumbnail.extension}')">
        ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
    <button onclick="viewSuperheroDetails('${superhero.id}')">View Details</button>
    `;

    superheroesList.appendChild(superheroCard);
});

// Store the superheroes data in localStorage
localStorage.setItem('superheroes', JSON.stringify(superheroes));
}

// Function to add or remove superhero from favorites
function toggleFavorites(superheroId, superheroName, superheroImage) {
const favoritesList = document.getElementById('favoritesList');
const favoritesIds = Array.from(favoritesList.children).map(favorite => favorite.dataset.superheroId);
const isFavorite = favoritesIds.includes(superheroId.toString());

if (isFavorite) {
    removeFromFavorites(superheroId);
} else {
    addToFavorites(superheroId, superheroName, superheroImage);
}

// Update the display
searchSuperheroes();
}

// Function to add superhero to favorites
function addToFavorites(superheroId, superheroName, superheroImage) {
const favoritesList = document.getElementById('favoritesList');
const favoriteSuperhero = document.createElement('div');
favoriteSuperhero.classList.add('favorite-card');
favoriteSuperhero.dataset.superheroId = superheroId;
favoriteSuperhero.innerHTML = `
    <h3>${superheroName}</h3>
    <img src="${superheroImage}" alt="${superheroName}">
    <button onclick="toggleFavorites('${superheroId}', '${superheroName}', '${superheroImage}')">Remove from Favorites</button>
`;
favoritesList.appendChild(favoriteSuperhero);

// Store the updated favorites data in localStorage
updateFavoritesInLocalStorage();
}

// Function to remove superhero from favorites
function removeFromFavorites(superheroId) {
const favoritesList = document.getElementById('favoritesList');
const superheroToRemove = document.querySelector(`.favorite-card[data-superhero-id="${superheroId}"]`);
favoritesList.removeChild(superheroToRemove);

// Store the updated favorites data in localStorage
updateFavoritesInLocalStorage();
}

// Function to update favorites data in localStorage
function updateFavoritesInLocalStorage() {
const favoritesList = document.getElementById('favoritesList');
const favoritesData = Array.from(favoritesList.children).map(favorite => ({
    id: favorite.dataset.superheroId,
    name: favorite.querySelector('h3').innerText,
    image: favorite.querySelector('img').src,
}));

localStorage.setItem('favorites', JSON.stringify(favoritesData));
}

// Function to view superhero details on a separate page
function viewSuperheroDetails(superheroId) {
const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hashVal}`;

// Fetch superhero details from the API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
    const superhero = data.data.results[0];
    displaySuperheroDetails(superhero);
    })
    .catch(error => console.error('Error fetching superhero details:', error));
}

// Function to display superhero details on the superhero page
function displaySuperheroDetails(superhero) {
document.getElementById('homePage').style.display = 'none';
document.getElementById('superheroPage').style.display = 'block';
document.getElementById('superheroName').innerText = superhero.name;
document.getElementById('superheroImage').src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
document.getElementById('superheroBio').innerText = "Description: " + superhero.description || 'No bio available.';
document.getElementById('comics').innerText = "Comics: " + superhero.comics.available || 'No comics available.';
document.getElementById('events').innerText = "Events: " + superhero.events.available || 'No events available.';
document.getElementById('stories').innerText = "Stories: " + superhero.stories.available || 'No stories available.';
document.getElementById('series').innerText = "Series: " + superhero.series.available || 'No series available.';
}

// Functions for navigation
function showHomePage() {
document.getElementById('homePage').style.display = 'block';
document.getElementById('superheroPage').style.display = 'none';
document.getElementById('myFavoritesPage').style.display = 'none';
}

function showMyFavoritesPage() {
document.getElementById('homePage').style.display = 'none';
document.getElementById('superheroPage').style.display = 'none';
document.getElementById('myFavoritesPage').style.display = 'block';
displayFavoritesFromLocalStorage(); // Display favorites from localStorage
}

// Function to display favorites from localStorage
function displayFavoritesFromLocalStorage() {
const favoritesList = document.getElementById('favoritesList');
const favoritesData = JSON.parse(localStorage.getItem('favorites')) || [];

favoritesList.innerHTML = '';

favoritesData.forEach(superhero => {
    const favoriteSuperhero = document.createElement('div');
    favoriteSuperhero.classList.add('favorite-card');
    favoriteSuperhero.dataset.superheroId = superhero.id;
    favoriteSuperhero.innerHTML = `
    <h3>${superhero.name}</h3>
    <img src="${superhero.image}" alt="${superhero.name}">
    <button onclick="toggleFavorites('${superhero.id}', '${superhero.name}', '${superhero.image}')">Remove from Favorites</button>
    `;
    favoritesList.appendChild(favoriteSuperhero);
});
}


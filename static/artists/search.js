export const searchInput = document.querySelector(".search-wrapper input");
const artistList = document.querySelector(".main-container");

export let artists = [];
export let locations = []; // locations[1] means locations for artist with id=1


export async function GetArtists() {
  try {
    const response = await fetch('http://localhost:8080/api/artists');
    if (!response.ok) {
      console.log('HTTP status code:', response.status);
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    artists = data;
  
    // Fetch location data for each artist
    await Promise.all(artists.map(artist => GetLocations(artist.id)));
  
    displayArtists(artists);
  } catch (e) {
    console.error('Error in fetch request:', e);
  }
  
}

export async function GetLocations(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/locations/${id}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    locations[id] = data.locations;
  } catch (e) {
    console.error('Error in fetch request:', e);
  }
}

export function displayArtists(artistData) {
  artistList.innerHTML = '';

  artistData.forEach(artist => {
    const artistCard = document.createElement('div');
    artistCard.classList.add('artist-card');

    const artistLink = document.createElement('a');
    artistLink.classList.add('ArtLink');
    artistLink.href = `/artist/${artist.id}`;

    const artistImage = document.createElement('img');
    artistImage.src = artist.image;
    artistImage.alt = 'Click here to go to the Artist page';

    const artistName = document.createElement('p');
    artistName.classList.add('artistName');
    artistName.textContent = artist.name;

    artistLink.appendChild(artistImage);
    artistLink.appendChild(artistName);
    artistCard.appendChild(artistLink);
    artistList.appendChild(artistCard);
  });
}

export function displayNoResult() {
  artistList.innerHTML = '<p>No results found</p>';
}

export function displaySuggestions(suggestions) {
  const resBox = document.querySelector('.result-box');
  resBox.innerHTML = ''; // Clear previous suggestions

  const uList = document.createElement('ul');
  resBox.appendChild(uList);

  suggestions.forEach(suggestion => {
    const suggestionElement = document.createElement('li');
    let linkTo = document.createElement('a')
    suggestionElement.appendChild(linkTo)
    linkTo.textContent = suggestion.text;
    const [name, type] = suggestion.text.split(" - ")
    suggestionElement.addEventListener('click', () => {
      searchInput.value = name;
      linkTo.href = `http://localhost:8080/artist/${suggestion.id}`
      window.location.href= linkTo.href;
      resBox.innerHTML = ''; // Clear suggestions
    });

    uList.appendChild(suggestionElement);
  });
}

export function clearSuggestions() {
  const resBox = document.querySelector('.result-box');
  resBox.innerHTML = '';
}

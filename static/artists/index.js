import { GetArtists, searchInput, displayArtists, displayNoResult, displaySuggestions, clearSuggestions, artists, locations, GetLocations  } from "./search.js";
import { syncRangeSliders } from "./filters.js";
import { creationRange, creationRangeEnd, creationRangeValueEnd, creationRangeValueStart, albumRange, albumRangeEnd , applyBtn } from "./filters.js";

GetArtists(); // Fetch artists and display them

// FILTERS 
// filter action
document.addEventListener('DOMContentLoaded', () => {
  const filterButton = document.getElementById('filter-button');
  const filtersContainer = document.querySelector('.filters-container');
  const filterIcon = document.getElementById('filter-icon');

  filterButton.addEventListener('click', () => {
    filtersContainer.classList.toggle('active');
    
    if (filtersContainer.classList.contains('active')) {
      filterIcon.style.fill = 'var(--OurPurple)';
    } else {
      filterIcon.style.fill = '';
    }
  });
});

// Sync sliders for Creation Date
syncRangeSliders(
  creationRange,
  creationRangeEnd,
  creationRangeValueStart,
  creationRangeValueEnd 
);

// add location
document.getElementById('addLocation').addEventListener('click', function() {
  const locationInput = document.getElementById('Location-Search');
  const locationValue = locationInput.value.trim();

  if (locationValue) {
      // Create a new div for the location
      const locationDiv = document.createElement('div');
      locationDiv.className = 'location-item';
      
      // Create the delete button (X)
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'X';
      
      // Add event listener to delete the location-item when X is clicked
      deleteButton.addEventListener('click', function() {
          locationDiv.remove();
      });
      
      // Append the delete button and the location value to the locationDiv
      locationDiv.appendChild(deleteButton);
      locationDiv.appendChild(document.createTextNode(locationValue));
      
      // Add the new location to LocationsFiltered
      document.getElementById('output-locations').appendChild(locationDiv);
      
      // Clear the input field
      locationInput.value = '';
  }
});

// keep check-box colored
document.querySelectorAll('.Members input[type="checkbox"]').forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
          checkbox.parentElement.classList.add('checked');
      } else {
          checkbox.parentElement.classList.remove('checked');
      }
  });
});

// ACTUAL FILTERING WHEN CLICKING Button
applyBtn.addEventListener('click', () => {
  // By Creation Date
  const startYearCreation = parseInt(creationRange.value, 10);
  const endYearCreation = parseInt(creationRangeEnd.value, 10);

  // By First Album Date
  const startDateAlbum = new Date(albumRange.value);
  const endDateAlbum = new Date(albumRangeEnd.value);

  // By Number of Members
  const selectedMembers = Array.from(document.querySelectorAll('.Members input[type="checkbox"]:checked'))
  .map(checkbox => parseInt(checkbox.id, 10));
  const isMembersFilterApplied = selectedMembers.length > 0;

  // By Locations
  const selectedLocations = Array.from(document.getElementById('output-locations').children)
    .map(child => 
    child.textContent.substring(1).trim().toLocaleLowerCase());
  const isLocationsFilterApplied = selectedLocations.length > 0;

  const filteredArtists = artists.filter(artist => {
    const artistCreationYear = parseInt(artist.creationDate, 10);
    
    const [day, month, year] = artist.firstAlbum.split('-').map(part => parseInt(part, 10));
    const artistFirstAlbumDate = new Date(year, month - 1, day); // month-1 cuz start from 0
    
    GetLocations(artist.id)
    const artistLocations = locations[artist.id];

    const hasMatchedLocation = artistLocations.some(location => 
      isLocationMatch(location, selectedLocations)
    );

    if(!isMembersFilterApplied && !isLocationsFilterApplied){
      return artistCreationYear >= startYearCreation && artistCreationYear <= endYearCreation &&
      artistFirstAlbumDate >= startDateAlbum && artistFirstAlbumDate <= endDateAlbum
    } else if (!isMembersFilterApplied){
      return artistCreationYear >= startYearCreation && artistCreationYear <= endYearCreation &&
      artistFirstAlbumDate >= startDateAlbum && artistFirstAlbumDate <= endDateAlbum && 
      hasMatchedLocation;
    } else if (!isLocationsFilterApplied){
      return artistCreationYear >= startYearCreation && artistCreationYear <= endYearCreation &&
      artistFirstAlbumDate >= startDateAlbum && artistFirstAlbumDate <= endDateAlbum && 
      selectedMembers.includes(artist.members.length);
    }

    return artistCreationYear >= startYearCreation && artistCreationYear <= endYearCreation &&
    artistFirstAlbumDate >= startDateAlbum && artistFirstAlbumDate <= endDateAlbum && 
    selectedMembers.includes(artist.members.length) &&
    hasMatchedLocation;
  });

  if (filteredArtists.length == 0){
    displayNoResult()
    return
  }
  // Display filtered artists
  displayArtists(filteredArtists);
});

function isLocationMatch(location, selectedLocations) {
  // Normalize location by converting to lowercase and removing unnecessary characters
  const normalizedLocation = location
    .toLowerCase()
    .replace(/[\s,.-]/g, ''); // Remove spaces, commas, periods, and hyphens

  // Check if any selected location matches the normalized location
  return selectedLocations.some(selected => {
    const normalizedSelected = selected
      .toLowerCase()
      .replace(/[\s,.-]/g, ''); // Normalize the selected location similarly
    return normalizedLocation.includes(normalizedSelected);
  });
}


// SEARCH
searchInput.addEventListener("input", (e) => {
  const input = e.target.value.toLowerCase();

  if (input === "") {
    clearSuggestions();
    displayArtists(artists); // Optionally, you can display all artists
    return;
  }

  const filteredArtists = [];
  const suggestions = [];

  artists.forEach(artist => {
    let matched = false;

    // Check if the artist's name matches the input
    if (artist.name.toLowerCase().includes(input)) {
      filteredArtists.push(artist);
      suggestions.push({text: `${artist.name} - artist/band`, id:artist.id});
      matched = true;
    }

    // Check if any member's name matches the input
    artist.members.forEach(member => {
      if (member.toLowerCase().includes(input)) {
        if (!matched) {
          filteredArtists.push(artist);
          matched = true;
        }
        suggestions.push({text: `${member} - member in ${artist.name}`, id:artist.id});
      }
    });

    // Check if the artist's first album matches the input
    if (artist.firstAlbum.includes(input)) {
      if (!matched) {
        filteredArtists.push(artist);
        matched = true;
      }
      suggestions.push({text:`${artist.firstAlbum} - first album for ${artist.name}`, id:artist.id});
    }

    // Check if the artist's creation date matches the input
    if (artist.creationDate.toString().includes(input)) {
      if (!matched) {
        filteredArtists.push(artist);
        matched = true;
      }
      suggestions.push({text:`${artist.creationDate} - creation date for ${artist.name}`, id:artist.id});
    }

    // Check if the input matches any locations of the band
    if (locations[artist.id]) { // if this artist has location
      locations[artist.id].forEach(location => {
        if (location.toLowerCase().includes(input)) {
          suggestions.push({text:`${location} - location in ${artist.name}`, id:artist.id});
          if (!matched) {
            filteredArtists.push(artist);
            matched = true;
          }
        }
      });
    }
  });

  if (filteredArtists.length === 0) {
    clearSuggestions();
    displayNoResult();
  } else {
    clearSuggestions();
    displaySuggestions(suggestions);
    displayArtists(filteredArtists);
  }
});

// RESET BUTTON 
document.getElementById('clear').addEventListener('click', () => {

  // creation date inputs
  creationRange.value = '1958'; 
  creationRangeEnd.value = '2018';

  // Reset album date inputs
  albumRange.value = '1963-01-01'; 
  albumRangeEnd.value = '2018-12-31';

  // Clear selected checkboxes
  document.querySelectorAll('.Members input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
    checkbox.parentElement.classList.remove('checked');
  });

  // Clear locations
  document.getElementById('output-locations').innerHTML = '';

  // Optionally, you can also reset any other filters or states if needed
});

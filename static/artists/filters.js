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
  document.getElementById('creationRange'),
  document.getElementById('creationRangeEnd'),
  document.getElementById('creationRangeValueStart'),
  document.getElementById('creationRangeValueEnd')
);

// Sync sliders for First Album Date
syncRangeSliders(
  document.getElementById('albumRange'),
  document.getElementById('albumRangeEnd'),
  document.getElementById('albumRangeValueStart'),
  document.getElementById('albumRangeValueEnd')
);

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
      document.getElementById('LocationsFiltered').appendChild(locationDiv);
      
      // Clear the input field
      locationInput.value = '';
  }
});


function syncRangeSliders(slider1, slider2, output1, output2) {
  const minGap = 1; // Minimum gap between the two sliders

  slider1.addEventListener('input', () => {
    if (parseInt(slider2.value) - parseInt(slider1.value) <= minGap) {
      slider1.value = parseInt(slider2.value) - minGap;
    }
    output1.textContent = slider1.value;
  });

  slider2.addEventListener('input', () => {
    if (parseInt(slider2.value) - parseInt(slider1.value) <= minGap) {
      slider2.value = parseInt(slider1.value) + minGap;
    }
    output2.textContent = slider2.value;
  });
}
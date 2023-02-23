const API_KEY = "3a2e49f97b09451b894200540231902";
const CITIES_API = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;
const pexels_API = "https://api.pexels.com/v1/search?query=";
const pexels_APIKEY = "oUW87bsRLnutP2FiIfvjEaKLPO6kTwJP6IZCnSEwBhu8SxhJUDWX3Ycy";

const body = document.querySelector("body");
const root = document.querySelector("#root");

// Create HTML for the whole app

const htmlCode = `
<div class="form">
  <div id="inputContainer">
      <input type="text" name="" id="" />
      <div id="cities"></div>
  </div>
  <button id="submit"><i class="fa-solid fa-arrow-right"></i></button>
</div>

  <div id="spinner" hidden></div>
  <p id="weatherFail" hidden>Please enter a city name.</p>
  <div class="weather-container">
    
  </div>
  <div class="favourites">
    <p id="favHL">Favourites</>
    <div id="favContainer"></div>
  </div>`;

// Insert base HTML code into page 
root.innerHTML = htmlCode;

// Declare and asign all the stati variables 
const toggleView = document.querySelector('.toggle-view');
const weatherContainer = document.querySelector(".weather-container");
const weatherFailMessage = document.querySelector("#weatherFail");
const cityInput = document.querySelector("input");
const dropdown = document.querySelector("#cities");
const submitBtn = document.querySelector("#submit");
const spinner = document.querySelector("#spinner");
const favourites = document.querySelector('.favourites div');

// Add the Toggle Visibility Functionality
toggleView.addEventListener('click', () => {

  if(root.classList.contains('hidden')){
    root.classList.toggle('transition');
    root.style.transform = 'translateX(-480px)';
    toggleView.style.transform = 'translateX(-480px)';
    toggleView.innerHTML = '<i class="fa-solid fa-x"></i>'
    root.classList.toggle('hidden');
    setTimeout(()=> {
      cityInput.focus();
    }, 900)

  } else {

    root.style.transform = 'translateX(0)';
    toggleView.style.transform = 'translateX(0)';
    toggleView.innerHTML = 'Weather'
    root.classList.toggle('hidden');

    setTimeout(()=> {

      root.classList.toggle('transition');

    }, 1000)

  }
})

// Function to render options into Dropdown
const renderDropdownOption = (city, country) => {
  return `<div class="option" data-name="${city}, ${country}">${city}, ${country}</div>`
}

// Function to display the dropdown menu
const showDropdown = (cities) => {
  if (cities.length === 0) {
    dropdown.style.display = "none";
    return;
  }

  dropdown.innerHTML = "";

  cities.forEach(city => {
    dropdown.innerHTML += renderDropdownOption(city.name, city.country);
  })

  // EventListener to Autocomplete the Input
  let allOptions = document.querySelectorAll('.option');

  allOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      cityInput.value = e.target.getAttribute('data-name');
      dropdown.style.display = "none";
    })
  })
  
  dropdown.style.display = "block";
}

// Function to fetch the cities that match the search query

const fetchCities = async (searchQuery) => {
  try {
    const response = await fetch(`${CITIES_API}${searchQuery}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.alert(error);
  }
}

// Event listener for the input field
cityInput.addEventListener("input", async (event) => {
  const searchQuery = event.target.value.trim();
  if (searchQuery.length === 0) {
    dropdown.style.display = "none";
    return;
  }
  const cities = await fetchCities(searchQuery);
  showDropdown(cities);
});

// Weather information html code
const renderWeather = (icon, city, country, temperature, condition) => {
  return `<div class="weather-image">
            <button id="favBtn">
            <i class="fa-regular fa-bookmark"></i>
            </button>
          </div>
          <div class="weather-info" >
              <div class="icon">
                  <img src="${icon}" alt="" />
              </div>
              <div class="info">
                  <p id="city">${city}, ${country}</p>
                  <div class="weather">
                    <p id="temperature">${temperature}°C</p>
                    <p id="sky">${condition}</p>
                  </div>

              </div>
          </div>`
}

// Empty array to fill with favourites
const favCities = [];

// Function to pass the html code of every fav
const renderFav = (city, index) => {
  return `<div class="favourite">
            <img src="${city.icon}" alt="">
            <p>${city.name}, ${city.country} - ${city.temperature}°C - ${city.condition}</p>
            <i class="fa-solid fa-trash" id ="${index}"></i>
          </div>`
}

// Code to create the favourite objects in order to render them afterwards
// will be called when clicking the Add to Fav button
const createFavs = (data, condition, temp_c) => {
  favourites.innerHTML = ''
  
  let favCity = {
    icon: condition.icon,
    name: data.location.name,
    country: data.location.country,
    temperature: temp_c,
    condition: condition.text
  }

  if (!favCities.includes(favCity)) {
    favCities.push(favCity);
  }
  
  if (favCities.length >= 4) {
    document.querySelector('.favourites').style.overflowY = 'scroll';
  }
  
  favCities.forEach((city, index) => {
    favourites.innerHTML += renderFav(city, index);
  })
}




// Event listener for the submit button
submitBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  
  if (city.length === 0) {
    weatherFailMessage.removeAttribute("hidden");
    return;
  }

  weatherFailMessage.hidden = "true";

  spinner.removeAttribute("hidden");

  setTimeout(async () => {

    try {

      spinner.hidden = "true";

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`
      );

      const data = await response.json();
      const { temp_c, condition } = data.current;

      weatherContainer.innerHTML = renderWeather(condition.icon, data.location.name, data.location.country, temp_c, condition.text)

      const favBtn = document.querySelector("#favBtn");
      const cityImage = document.querySelector('.weather-image');
      
      // Second promise for the city pictures in order to catch the error in case there is no response on this part and put a default image instead


      try {
        const pexelsResponse = await fetch(`${pexels_API}${city.split(',')[0]}`, {
          headers: {
            Authorization: pexels_APIKEY
          }
        });
        
        const picData = await pexelsResponse.json();
        
        const picURL = picData.photos[0].src.large;
        cityImage.style.backgroundImage = `url(${picURL})`;

      } catch(error){

        cityImage.style.backgroundImage = `url(./assets/img/ezgif.com-resize.png)`;
        
      }
      
      // Add to Fav
      favBtn.addEventListener("click", () => {

        createFavs(data, condition, temp_c);

        // EventListener to erase favourites
        let allEraseBtns = document.querySelectorAll('.favourite i');

        // we take the id of the erase button to choose the element in the array and splice it
        allEraseBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            favCities.splice(e.target.id, 1);
            e.target.parentElement.remove();
          })
        })

        // Once the element is in the array of favs we hide the addTo button
        favBtn.hidden = "true";
      });

    } catch (error) {
      console.error(error);
      weatherFailMessage.textContent =
        "Something went wrong. Please try again.";
    }
  }, 500);
  cityInput.value = '';
  cityInput.focus();

});

const API_KEY = "3a2e49f97b09451b894200540231902";
const WEATHER_API = "https://api.weatherapi.com/v1/current.json?key="
const CITIES_API = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;
const PEXELS_API = "https://api.pexels.com/v1/search?query=";

// Create HTML for the whole app
const formHTML = 
  `<div class="form">
      <div id="favBtnContainer">
        <button id="favBtn" hidden><i class="fa-regular fa-bookmark"></i></button>
      </div>
      <div id="inputContainer">
          <input id="city-input" type="text">
          <div id="cities"></div>
      </div>
      <button id="submit">Get Weather</button>
    </div>
    <div id="spinner" hidden></div>
    <p id="weatherFail" hidden>Please enter a city name.</p>      
    </div>`

const weatherHTML = 
` <div class="weather-container">
    <div class="info">
      <p id="city"></p>
      <p id="temperature"></p>
      <p id="sky"></p>
      <div class="icon">
        <img src="">
      </div>
    </div>
  </div>`


//insert Elements into DOM
const body = document.querySelector("body");
const root = document.querySelector("#root");
root.innerHTML = formHTML;

const cityInput = document.querySelector("#city-input");
const weatherFailMessage = document.querySelector("#weatherFail");
const dropdown = document.querySelector("#cities");
const submitBtn = document.querySelector("#submit")
const spinner = document.querySelector("#spinner");
const favBtn = document.querySelector("#favBtn");

const weatherInfo = document.createElement("div");
body.appendChild(weatherInfo);
weatherInfo.innerHTML = weatherHTML;
weatherInfo.id = "weather-info";
weatherInfo.style.display = "none";
const weatherContainer = document.querySelector(".weather-container");
const weatherIcon = document.querySelector(".icon img");
const cityName = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const sky = document.querySelector("#sky");

const favBookmarks = document.createElement("div");
body.appendChild(favBookmarks);
favBookmarks.className = "favorite-bookmarks";
favBookmarks.style.display = "none";

// Function to display the dropdown menu
function showDropdown(cities) {
  if (cities.length === 0) {
    dropdown.style.display = "none";
    return;
  }
  dropdown.innerHTML = "";
  for (const city of cities) {
    const option = document.createElement("div");
    option.textContent = `${city.name}, ${city.country}`;
    option.style.cursor = "pointer";
    option.addEventListener("click", () => {
      console.log(city.name);
      cityInput.value = city.name;
      dropdown.style.display = "none";
    });
    dropdown.appendChild(option);
  }
  dropdown.style.display = "block";
}

// Function to fetch the cities that match the search query
async function fetchCities(searchQuery) {
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

//Event listener for favorites dropdown
cityInput.addEventListener("focus", () => {
  if (favCities.length > 0) {
    dropdown.innerHTML = "";
    const favHead = document.createElement("h2");
    favHead.innerText = "Favorites";
    favHead.style.fontSize = "1.3rem";
    favHead.style.padding = "10px";
    dropdown.appendChild(favHead);
    for (const city of favCities) {
      const option = document.createElement("div");
      option.textContent = city;
      option.style.cursor = "pointer";
      option.addEventListener("click", () => {
        cityInput.value = city.split(",")[0];
        dropdown.style.display = "none";
      });
      dropdown.appendChild(option);
    }
    dropdown.style.display = "block";
  }
})

document.addEventListener("click", (e) => {
  if(e.target !== cityInput) {
    dropdown.style.display = "none";
  }
})

const favCities = [];

// Event listener for the submit button
submitBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (city.length === 0) {
    weatherFailMessage.removeAttribute("hidden");
    return;
  }
  spinner.removeAttribute("hidden");

  setTimeout(async () => {
    try {
      favBtn.removeAttribute("hidden");
      spinner.hidden = "true";
      weatherInfo.style.display = "flex";
      
      const response = await fetch(`${WEATHER_API}${API_KEY}&q=${city}&aqi=yes`);
      const data = await response.json();
      const { temp_c, condition } = data.current;
      cityName.innerHTML = `${data.location.name}, ${data.location.country}`;
      temperature.innerHTML = `${temp_c}°`;
      sky.innerHTML = `${condition.text}`;
      weatherIcon.setAttribute("src", condition.icon);

      const pexelsResponse = await fetch(`${PEXELS_API}${city}`);
      const picData = await pexelsResponse.json();
      const picURL = picData.photos[0].src.large;
      root.style.backgroundImage = `url(${picURL})`;
      root.style.backgroundSize = "cover";
      root.style.backgroundPosition = "center";

      const placeholder = `<div style="display: block; height: 50%; width: 10%; margin: 0px 25px; background-color: grey; border-radius: 30px;"></div>`
      
      favBtn.addEventListener("click", async () => {
        if (!favCities.includes(`${data.location.name}, ${data.location.country}`)) {
          favCities.push(`${data.location.name}, ${data.location.country}`);
          if (favCities.length <= 5) {
            favBookmarks.style.display = "flex";
            const bookmark = document.createElement("div");
            const bookmarkName = document.createElement("p");
            const bookmarkIMG = document.createElement("img");
            bookmarkIMG.src = "";
            favBookmarks.appendChild(bookmark);
            bookmark.appendChild(bookmarkName);
            bookmark.appendChild(bookmarkIMG);
            bookmarkName.innerText = `${data.location.name}`;
            bookmarkIMG.setAttribute("src", condition.icon);
          }
          for(let i=0; i<(5-favCities.length); i++) {
            favBookmarks.innerHTML += placeholder;
          }
        }
        favBtn.hidden = "true";
      })
    } catch (error) {
      console.error(error);
      weatherFailMessage.textContent = "Something went wrong. Please try again.";
    } 
  }, 1000)
});

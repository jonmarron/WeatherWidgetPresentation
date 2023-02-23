const API_KEY = "3a2e49f97b09451b894200540231902";
const WEATHER_API = "https://api.weatherapi.com/v1/current.json?key="
const CITIES_API = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;
const PEXELS_API = "https://api.pexels.com/v1/search?query=";
const PEXELS_APIKEY = "vTvJJwRp26H5djql8kUoPPuZvRpIgUbxJBLHp637UscIfJybz47iN12G";

// Create HTML for the whole app
const formHTML = 
  `<div class="form">
      <div id="favBtnContainer">
        <button id="favBtn"><i class="fa-regular fa-bookmark"></i></button>
      </div>
      <div id="inputContainer">
          <input id="city-input" type="text">
          <div id="cities"></div>
      </div>
      <button type="button" id="submit">Get Weather</button>
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

const showWidget = document.createElement("button");
showWidget.id = "show-widget";
showWidget.innerHTML = `<i class="fa-solid fa-greater-than"></i>`;
body.appendChild(showWidget);

const hideWidget = document.createElement("button");
hideWidget.id = "hide-widget";
hideWidget.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
body.appendChild(hideWidget);

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
const weatherIcon = document.querySelector(".icon img");
const cityName = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const sky = document.querySelector("#sky");

const placeholder = `<div style="display: block; height: 80%; width: 70%; margin: 0px 25px; background-color: grey; border-radius: 30px;"></div>`
const favBookmarks = document.createElement("div");
body.appendChild(favBookmarks);
favBookmarks.className = "favorite-bookmarks";
favBookmarks.style.display = "none";
const placeholder1 = document.createElement("div");
placeholder1.innerHTML = placeholder;
placeholder1.style.display = "flex";
placeholder1.style.width = "100%";
placeholder1.style.height = "100%";
favBookmarks.appendChild(placeholder1);
const placeholder2 = document.createElement("div");
placeholder2.innerHTML = placeholder;
placeholder2.style.display = "flex";
placeholder2.style.width = "100%";
placeholder2.style.height = "100%";
favBookmarks.appendChild(placeholder2);
const placeholder3 = document.createElement("div");
placeholder3.innerHTML = placeholder;
placeholder3.style.display = "flex";
placeholder3.style.width = "100%";
placeholder3.style.height = "100%";
favBookmarks.appendChild(placeholder3);
const placeholder4 = document.createElement("div");
placeholder4.innerHTML = placeholder;
placeholder4.style.display = "flex";
placeholder4.style.width = "100%";
placeholder4.style.height = "100%";
favBookmarks.appendChild(placeholder4);
const placeholder5 = document.createElement("div");
placeholder5.innerHTML = placeholder;
placeholder5.style.display = "flex";
placeholder5.style.width = "100%";
placeholder5.style.height = "100%";
favBookmarks.appendChild(placeholder5);

const favCities = [null,null,null,null,null];
const favContainer = [placeholder1,placeholder2,placeholder3,placeholder4,placeholder5];
let cityCounter = 0;
let tempValue = "";
let weatherConditionValue = "";
let cityValue = "";
let countryValue = "";
let iconSRC = "";

//eventlistener to show the widget
showWidget.addEventListener("click", () => {
  root.style.transform = "translateX(565px)";
  showWidget.style.transform = "translateX(565px)";
  setTimeout(()=> {
    hideWidget.style.transform = "translateX(565px)";
    hideWidget.style.display = "flex";
  },250)
  if (
  weatherInfo.style.display === "flex" || 
  favBookmarks.style.display === "flex") {
    setTimeout(()=> {
      weatherInfo.style.transform = "translateX(556px)";
      favBookmarks.style.transform = "translateX(575px)";
    },200);
  }
  showWidget.style.display = "none";
})

hideWidget.addEventListener("click", () => {
  root.style.transform = "translateX(10px)";
  showWidget.style.transform = "translateX(10px)";
  setTimeout(()=> {
    hideWidget.style.transform = "translateX(10px)";
    showWidget.style.display = "flex";
  },250)
  if (
  weatherInfo.style.display === "flex" || 
  favBookmarks.style.display === "flex") {
    setTimeout(()=> {
      weatherInfo.style.transform = "translateX(2px)";
      favBookmarks.style.transform = "translateX(19px)";
    },200);
  }
  hideWidget.style.display = "none";
})

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

//hide dropdown
document.addEventListener("click", (e) => {
  if(e.target !== cityInput) {
    dropdown.style.display = "none";
  }
});

//Get Pexel Img and render it
const getPexelImg = async (city) => {
  try {
    const pexelsResponse = await fetch(`${PEXELS_API}${city}`, {
      headers: {
        Authorization: PEXELS_APIKEY
      }
    });
    const picData = await pexelsResponse.json();
    const picURL = picData.photos[0].src.large;
    root.style.backgroundImage = `url(${picURL})`;
    root.style.backgroundSize = "cover";
    root.style.backgroundPosition = "center";
  } catch(error) {
    root.style.backgroundImage = "url(https://images.pexels.com/photos/1605148/pexels-photo-1605148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)";
    root.style.backgroundSize = "cover";
    root.style.backgroundPosition = "center";
  }
}

// Event listener for the submit button
submitBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!favCities.includes(city)) {
    favBtn.removeAttribute("hidden");
  }
  if (city.length === 0) {
    weatherFailMessage.removeAttribute("hidden");
    return;
  }
  spinner.removeAttribute("hidden");

  setTimeout(async () => {
    try {
      spinner.hidden = "true";
      weatherInfo.style.display = "flex";
      const response = await fetch(`${WEATHER_API}${API_KEY}&q=${city}&aqi=yes`);
      const data = await response.json();
      const { temp_c, condition } = data.current;
      tempValue = temp_c;
      weatherConditionValue = condition.text;
      cityValue = data.location.name;
      countryValue = data.location.country;
      iconSRC = condition.icon;

      getPexelImg(city);
      renderWeatherInfo();

    } catch (error) {
      console.error(error);
      weatherFailMessage.textContent = "Something went wrong. Please try again.";
    }
  }, 1000)
});

//render weatherInfo
const renderWeatherInfo = () => {
  weatherInfo.style.transform = "translateX(557px)";
  cityName.innerHTML = `${cityValue}, ${countryValue}`;
  temperature.innerHTML = `${tempValue}°`;
  sky.innerHTML = `${weatherConditionValue}`;
  weatherIcon.setAttribute("src", `http:${iconSRC}`);
}

//Construct favCities Array and render favBookmarks
const renderFav = () => {
  console.log(cityValue);
  console.log("a", favCities);
  cityCounter++;
  if (!favCities.includes(cityValue)) {
    favBookmarks.style.display = "flex";
    favCities[cityCounter-1] = cityValue;
    for(let i=0; i<favCities.length; i++) {
      if (favCities[i] === cityValue) {
        favContainer[cityCounter-1].innerHTML = `<div>${cityValue}<img src="http:${iconSRC}"></div>`;
      }
    }
    if (favCities.includes(cityValue)) {
      favBtn.setAttribute("hidden", true);
    }
    if (favBookmarks.style.display === "flex") {
      setTimeout(() => {
        favBookmarks.style.transform = "translateX(575px)";
      },200);
    }
  }
  console.log(favCities);
}

favBtn.addEventListener("click", renderFav);

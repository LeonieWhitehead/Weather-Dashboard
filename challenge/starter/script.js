//API
const apiKey = "e986b04b35ee7c9c4a0262bfa1992a02";



//Pull elements from the HTML
const searchForm = $('#search-form');
const searchInput = $('#search-input');
const todaySection = $('#today');
const forecastSection = $('#forecast');
const historyList = $('#history');
const currentWeatherCard = $('#current-weather-card');
const locationElement = $('#location');
const dateElement = $('#date');
const iconElement = $('#icon');
const temperatureElement = $('#temperature');
const windElement = $('#wind');
const humidityElement = $('#humidity');

// let currentCity;
let cityHistory = [];

function saveCityHistory() {
  localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
}

// Function to get coordinates for a city
function getCoordinates(city) {
  const coordinatesURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  return fetch(coordinatesURL)
    .then(response => response.json())
    .then(data => {
      const coordinates = {
        lat: data.coord.lat,
        lon: data.coord.lon
      };
      return coordinates;
    })
    .catch(error => console.error("Error getting coordinates:", error));
}
function updateCurrentWeatherCard(data, temperatureCelsius) {
  // Update HTML elements
  locationElement.text(data.name);
  dateElement.text(dayjs().format('MMMM D, YYYY'));
  iconElement.attr('src', `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
  // Convert temperature from Fahrenheit to Celsius
  temperatureCelsius = ((data.main.temp - 32) * 5) / 9;
  temperatureElement.text(`${temperatureCelsius.toFixed(2)} °C`);
  windElement.text(`${data.wind.speed} mph`);
  humidityElement.text(`${data.main.humidity}%`);
}
// Function to get weather data
function getWeather(coordinates) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;


  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      // Convert temperature from Fahrenheit to Celsius
      const temperatureCelsius = ((data.main.temp - 32) * 5) / 9;
      // Log the queryURL
      console.log("Query URL:", queryURL);
      console.log(data);

      // Update the current weather card
      updateCurrentWeatherCard(data, temperatureCelsius);
    })
    .catch(error => console.error("Error getting weather data:", error));
}
function updateForecastCards(data, elements) {
  if (data && Array.isArray(data[index].dt).format('MMMM D, YYYY')) {
    console.log("5-day forecast data:", data);
    elements.forEach((element, index) => {
      const date = dayjs.unix(data[index].dt).format('MMMM D, YYYY');
      const iconURL = `https://openweathermap.org/img/w/${data[index].weather[0].icon}.png`;
      const temperature = data[index].temp.day;
      const wind = data[index].wind_speed;
      const humidity = data[index].humidity;

      // Convert temperature from Fahrenheit to Celsius for each forecast card
      const temperatureCelsiusForCard = ((temperature - 32) * 5) / 9;

      $(`.${element}-date`).text(date);
      $(`.${element}-icon`).attr('src', iconURL);
      $(`.${element}-temp`).text(`Temp: ${temperatureCelsiusForCard.toFixed(2)} °C`)
      $(`.${element}-wind`).text(`Wind: ${wind} mph`);
      $(`.${element}-humidity`).text(`Humidity: ${humidity}%`);
    });
  } else {
    console.error("Error: Forecast data is undefined or not an array.");
  }
}

function getForecast(coordinates) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
  console.log(forecastURL)
  fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
      // Log the queryURL
      console.log("Forecast URL:", forecastURL);
      console.log(data);

      // Update the 5-day forecast cards
      updateForecastCards(data.list, ['day1', 'day2', 'day3', 'day4', 'day5']);
    })
    .catch(error => console.error("Error getting forecast data:", error));

}

// Event listener for form submission
searchForm.on('submit', function (event) {
  event.preventDefault();
  const city = searchInput.val().trim();
  if (city !== '') {
    // Get coordinates for the city
    getCoordinates(city)
      .then(coordinates => {
        // Use coordinates to get weather data
        getWeather(coordinates);
        // Add the searched city to history
        addToHistory(city);
        // Get 5-day forecast for the city
        getForecast(coordinates);
      })
      .catch(error => console.error("Error:", error));
  }
});

// Function to add a city to the history
function addToHistory(city) {
  // Add the city to the history array
  cityHistory.push(city);

  if (cityHistory.length > 5) {
    cityHistory.shift(); // Remove the oldest entry
  }
  // Update the history list in the HTML
  updateHistoryList();
  saveCityHistory();
}

// Function to update the history list in the HTML
function updateHistoryList() {
  // Clear the existing history list
  historyList.empty();

  // Add buttons for each city in the history array
  cityHistory.forEach(city => {
    const historyButton = $('<button>')
      .addClass('history-button')
      .text(city)
      .on('click', function () {
        // When a history button is clicked, perform a new search for that city
        searchInput.val(city);
        searchForm.trigger('submit');
      });

      historyList.append(historyButton);
    });
  }
$(document).ready(function () {
        // Load cityHistory from local storage if available
        const storedCityHistory = localStorage.getItem('cityHistory');
        if (storedCityHistory) {
          cityHistory = JSON.parse(storedCityHistory);
          updateHistoryList();
        }
      });

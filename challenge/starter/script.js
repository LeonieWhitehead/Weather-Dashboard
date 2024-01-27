//API
const apiKey = "4d259587f0ac609bbd27b9095095a860";

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
      })
      .catch(error => console.error("Error:", error));
  }
});

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

function getForecast(coordinates) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=imperial`;

  fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
      // Log the queryURL
      console.log("Forecast URL:", forecastURL);
      console.log(data);

      // Update the 5-day forecast cards
      updateForecastCards(data.daily.slice(1, 6), ['day1', 'day2', 'day3', 'day4', 'day5']);
    })
    .catch(error => console.error("Error getting forecast data:", error));

}

function updateForecastCards(data, elements) {
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
  })
}

//API
const apiKey = "4d259587f0ac609bbd27b9095095a860";

//Pull elements from the HTML
const searchForm = $('#search-form');
const searchInput = $('#search-input');
const todaySection = $('#today');
const forecastSection = $('#forecast');
const historyList = $('#history');

let currentCity;

// Function to get weather data

function getWeather(data) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        // Log the queryURL
        console.log("Query URL:", queryURL);
        console.log(data);
      })
      .catch(function (error) {
  });
}

//what is needed for search section; input field, button

//what is needed for current day weather card; location, date, icon, temp, wind and humidity

//what sections are on each card; date, icon, temp, wind and humidity
// const dateEl = $("#date");
// const currentWeatherEl = $("#date");


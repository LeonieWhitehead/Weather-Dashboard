//API
let APIKey = "4d259587f0ac609bbd27b9095095a860";

function getWeatherForecast(lat, lon) {  
let queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

fetch(queryURL)
.then(function (response) {
  return response.json();
  })
}
//what is needed for search section; input field, button

//what is needed for current day weather card; location, date, icon, temp, wind and humidity

//what sections are on each card; date, icon, temp, wind and humidity
const dateEl = $("#date");
const currentWeatherEl = $("#date");


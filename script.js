const apiKey = '8f345d03578547f1fe731714f7eab502';
const weatherForm = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const weatherInfo = document.getElementById('weatherInfo');

const defaultLocation = 'Kigali';

window.addEventListener('load', () => {
  getWeatherData(defaultLocation);
});

weatherForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const location = locationInput.value;
  if (location) {
    getWeatherData(location);
  }
});

async function getWeatherData(location) {
  try {
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();

    displayWeatherData(currentWeatherData, forecastData);
  } catch (error) {
    console.log('Error fetching weather data:', error);
  }
}

function displayWeatherData(currentData, forecastData) {
  const currentWeatherData = {
    city: currentData.name,
    country: currentData.sys.country,
    temperature: currentData.main.temp,
    description: currentData.weather[0].description,
    humidity: currentData.main.humidity,
    windSpeed: currentData.wind.speed,
    windDirection: currentData.wind.deg,
    rain: currentData.rain ? currentData.rain['1h'] : 0,
    cloudiness: currentData.clouds.all,
    pressure: currentData.main.pressure,
    sunshineQuantity: currentData.snow ? currentData.snow['1h'] : 0,
    date: new Date(currentData.dt * 1000),
};

  const currentWeatherTable = createWeatherTable(currentWeatherData);
  currentWeatherTable.classList.add('weather-box'); 
  weatherInfo.innerHTML = '';
  weatherInfo.appendChild(currentWeatherTable);

  const forecastNextHours = forecastData.list.slice(0, 5); 
  const nextHoursTable = createNextHoursTable(forecastNextHours);
  nextHoursTable.classList.add('weather-box'); 
  weatherInfo.appendChild(nextHoursTable);
}

function createWeatherTable(data) {
  const table = document.createElement('table');
  table.innerHTML = `
    <caption>Current Weather</caption>
    <tr>
      <td><strong>Location:</strong></td>
      <td>${data.city}, ${data.country}</td>
    </tr>
    <tr>
      <td><strong>Temperature:</strong></td>
      <td>${convertKelvinToCelsius(data.temperature)}°C</td>
    </tr>
    <tr>
      <td><strong>Description:</strong></td>
      <td>${data.description}</td>
    </tr>
    <tr>
      <td><strong>Humidity:</strong></td>
      <td>${data.humidity}%</td>
    </tr>
    <tr>
      <td><strong>Wind Speed:</strong></td>
      <td>${data.windSpeed} m/s</td>
    </tr>
    <tr>
      <td><strong>Wind Direction:</strong></td>
      <td>${data.windDirection}°</td>
    </tr>
    <tr>
      <td><strong>Rain (last hour):</strong></td>
      <td>${data.rain} mm</td>
    </tr>
    <tr>
      <td><strong>Cloudiness:</strong></td>
      <td>${data.cloudiness}%</td>
    </tr>
    <tr>
      <td><strong>Date:</strong></td>
      <td>${formatDate(data.date)}</td>
    </tr>
  `;
  return table;
}

function createNextHoursTable(data) {
  const table = document.createElement('table');
  table.innerHTML = `
    <caption>Next Hours Forecast</caption>
    <tr>
      <th><strong>Time</strong></th>
      <th><strong>Temperature</strong></th>
      <th><strong>Description</strong></th>
    </tr>
  `;
  data.forEach((hourData) => {
    const dateTime = new Date(hourData.dt * 1000);
    const time = formatTime(dateTime);
    const temperature = convertKelvinToCelsius(hourData.main.temp);
    const description = hourData.weather[0].description;

    table.innerHTML += `
      <tr>
        <td>${time}</td>
        <td>${temperature}°C</td>
        <td>${description}</td>
      </tr>
    `;
  });
  return table;
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function formatTime(date) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return date.toLocaleTimeString(undefined, options);
}

function convertKelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

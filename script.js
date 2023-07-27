const apiKey = '8f345d03578547f1fe731714f7eab502';
const weatherForm = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const weatherInfo = document.getElementById('weatherInfo');

// Set "Kigali" as the default location
const defaultLocation = 'Kigali';

// Fetch weather data for the default location when the page loads
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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    console.log('Error fetching weather data:', error);
  }
}

function displayWeatherData(data) {
  const weatherData = {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    description: data.weather[0].description,
  };

  weatherInfo.innerHTML = `
    <p><strong>Location:</strong> ${weatherData.city}, ${weatherData.country}</p>
    <p><strong>Temperature:</strong> ${convertKelvinToCelsius(weatherData.temperature)}°C</p>
    <p><strong>Description:</strong> ${weatherData.description}</p>
  `;
}

function convertKelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

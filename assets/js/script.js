let cities = [];

// function to store city in local storage
function storeCity(cityName) { 
    cities.push(cityName); 
    localStorage.setItem('cities', JSON.stringify(cities)); 
    displayCities();

}

function searchButtonClicked() {
    const searchInput = document.getElementById('searchInput');
    const cityName = searchInput.value;
    storeCity(cityName);
    getWeatherDataForFiveDays(cityName);
    searchInput.value = '';

}

function searchInputKeyPressed(event) {
    if (event.key === 'Enter') {
        searchButtonClicked();
    }
}

function clearCities() {
    cities = [];
    localStorage.setItem('cities', JSON.stringify(cities));
    displayCities();
}

function displayCities() {
    const citiesList = document.getElementById('citiesList');
    citiesList.innerHTML = '';

    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        citiesList.appendChild(listItem);
    });

}
function convertToMilesPerHour(windSpeed) {
    return windSpeed * 2.237;
}


function getLatitudeAndLongitude(cityName) {
    const apiKey = '69ce3649bde3cf3c056b602967f1fe88';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const latitude = data.coord.lat;
            const longitude = data.coord.lon;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function getPresentAndNextFourDays() {
    const presentDate = new Date().toLocaleDateString();
    const nextFourDays = [];

    for (let i = 1; i <= 4; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        nextFourDays.push(date.toLocaleDateString());
    }

    return { presentDate, nextFourDays };
}

const temperatureInFahrenheit = (temperature) => {
    return (temperature) / 5 + 32; 
};

function getTemperatureAt1245PM(cityName) {
    const apiKey = '69ce3649bde3cf3c056b602967f1fe88';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastData = data.list;
            const temperatureAt1245PM = forecastData.find(forecast => {
                const forecastTime = new Date(forecast.dt * 1000);
                return forecastTime.getHours() === 12 && forecastTime.getMinutes() === 45;
            }).main.temp;
            console.log(`Temperature at 12:45 PM: ${temperatureInFahrenheit(temperatureAt1245PM).toFixed(2)}°F`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function displayFiveDayForecast(fiveDayData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    fiveDayData.forEach(data => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        const dateElement = document.createElement('p');
        dateElement.textContent = data.date;

        const weatherIconElement = document.createElement('img');
        weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weatherIcon}.png`;

        const temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${temperatureInFahrenheit(data.temperature).toFixed(2)}°F`;

        const windSpeedElement = document.createElement('p');
        windSpeedElement.textContent = `Wind Speed: ${convertToMilesPerHour(data.windSpeed)} mph`;

        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${data.humidity}%`;

        forecastCard.appendChild(dateElement);
        forecastCard.appendChild(weatherIconElement);
        forecastCard.appendChild(temperatureElement);
        forecastCard.appendChild(windSpeedElement);
        forecastCard.appendChild(humidityElement);

        forecastContainer.appendChild(forecastCard);
    });

    return forecastContainer;
}

function displayWeatherData(weatherData) {
    const weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.innerHTML = '';

    const currentWeatherData = weatherData[0];
    const fiveDayForecastData = weatherData.slice(1);

    const currentWeatherCard = document.createElement('div');
    currentWeatherCard.classList.add('weather-card');

    const cityElement = document.createElement('h2');
    cityElement.textContent = currentWeatherData.city;

    const dateElement = document.createElement('p');
    dateElement.textContent = currentWeatherData.date;

    const weatherIconElement = document.createElement('img');
    weatherIconElement.src = `https://openweathermap.org/img/wn/${currentWeatherData.weatherIcon}.png`;

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `Temperature: ${temperatureInFahrenheit(currentWeatherData.temperature).toFixed(2)}°F`;

    const windSpeedElement = document.createElement('p');
    windSpeedElement.textContent = `Wind Speed: ${convertToMilesPerHour(currentWeatherData.windSpeed)} mph`;

    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${currentWeatherData.humidity}%`;

    currentWeatherCard.appendChild(cityElement);
    currentWeatherCard.appendChild(dateElement);
    currentWeatherCard.appendChild(weatherIconElement);
    currentWeatherCard.appendChild(temperatureElement);
    currentWeatherCard.appendChild(windSpeedElement);
    currentWeatherCard.appendChild(humidityElement);

    weatherContainer.appendChild(currentWeatherCard);

    displayFiveDayForecast(fiveDayForecastData);
}

function getWeatherDataForFiveDays(cityName) {
    const apiKey = '69ce3649bde3cf3c056b602967f1fe88';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherData = [];

            for (let i = 0; i < data.list.length; i += 8) {
                const city = data.city.name;
                const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
                const weatherIcon = data.list[i].weather[0].icon;
                const temperature = data.list[i].main.temp;
                const windSpeed = data.list[i].wind.speed;
                const humidity = data.list[i].main.humidity;

                weatherData.push({ city, date, weatherIcon, temperature, windSpeed, humidity });
            }

            displayWeatherData(weatherData);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}



function searchCity() {
    const storedCities = localStorage.getItem('cities');
    if (storedCities) {
        cities = JSON.parse(storedCities);
    }
    return cities;
}

// create event listener for search button
document.getElementById('searchButton').addEventListener('click', searchButtonClicked);
document.getElementById('searchInput').addEventListener('keypress', searchInputKeyPressed);
document.getElementById('clearButton').addEventListener('click', clearCities);


// Call functions on page load
displayCities();
getPresentAndNextFourDays();
searchCity();



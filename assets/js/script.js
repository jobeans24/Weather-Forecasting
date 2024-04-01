let cities = [];

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

function displayCities() {
    const citiesList = document.getElementById('citiesList');
    citiesList.innerHTML = '';

    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        citiesList.appendChild(listItem);
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

function displayWeatherData(weatherData) {
    const weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.innerHTML = '';

    weatherData.forEach(data => {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather-card');

        const cityElement = document.createElement('h2');
        cityElement.textContent = data.city;

        const dateElement = document.createElement('p');
        dateElement.textContent = data.date;

        const weatherIconElement = document.createElement('img');
        weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weatherIcon}.png`;

        const temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${data.temperature}°C`;

        const windSpeedElement = document.createElement('p');
        windSpeedElement.textContent = `Wind Speed: ${data.windSpeed} m/s`;

        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${data.humidity}%`;

        weatherCard.appendChild(cityElement);
        weatherCard.appendChild(dateElement);
        weatherCard.appendChild(weatherIconElement);
        weatherCard.appendChild(temperatureElement);
        weatherCard.appendChild(windSpeedElement);
        weatherCard.appendChild(humidityElement);

        weatherContainer.appendChild(weatherCard);
    });
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
    const searchValue = window.location.pathname.split('/').pop();
    getWeatherDataForFiveDays(searchValue);
}

// create event listeners
document.getElementById('searchButton').addEventListener('click', searchButtonClicked);
document.getElementById('searchInput').addEventListener('keypress', searchInputKeyPressed);


// Call functions on page load
displayCities();
getPresentAndNextFourDays();
searchCity();


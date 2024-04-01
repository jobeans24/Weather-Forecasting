let cities = [];

function storeCity(cityName) {
    let cities = localStorage.getItem('cities');
    if (cities) {
        cities = JSON.parse(cities);
    } else {
        cities = [];
    }
    cities.push(cityName);
    localStorage.setItem('cities', JSON.stringify(cities));
}
// this function is called when the search button is clicked
function searchButtonClicked() {
    var searchInput = document.getElementById('searchInput');
    var searchValue = searchInput.value;
    if (searchValue) {
        window.location.href = '/search/' + searchValue; // redirect to the search page
        storeCity(searchValue); // store the city in local storage
    }
    else {
        alert('Please enter a search term'); // show an alert if the search input is empty
    }
}
// this function is called when the enter key is pressed in the search input
function searchInputKeyPressed(event) {
    if (event.key === 'Enter') {
        searchButtonClicked();
    }
}

// this function is called when the page is loaded
function displayCities() {
    let cities = localStorage.getItem('cities'); // get the cities from local storage
    if (cities) {
        cities = JSON.parse(cities);
        const citiesList = document.getElementById('citiesList'); // get the cities list element
        citiesList.innerHTML = '';
        cities.forEach((city) => {
            const cityElement = document.createElement('li'); // create a list item for each city
            cityElement.innerHTML = city;
            citiesList.appendChild(cityElement);
        });
    }
}

// this function is called when the page is loaded
function getPresentAndNextFourDays() { // get the present day and the next four days
    const presentDay = new Date().toLocaleDateString(); // get the present day
    const nextFourDays = []; // get the next four days
    for (let i = 1; i <= 4; i++) {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + i);
        nextFourDays.push(nextDay.toLocaleDateString());
    }
    return { presentDay, nextFourDays };
}


function displayWeatherData(weatherData) {
    const weatherBox = document.getElementById('weather-box');
    weatherBox.innerHTML = '';

    weatherData.forEach((data) => {
        const { city, date, weatherIcon, temperature, windSpeed, humidity } = data;

        const weatherInfo = document.createElement('div');
        weatherInfo.style.backgroundColor = 'blue';
        weatherInfo.style.color = 'white';
        weatherInfo.innerHTML = `
            <p>City: ${city}</p> 
            <p>Date: ${date}</p>
            <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
            <p>Temperature: ${temperature}°C</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;

        weatherBox.appendChild(weatherInfo);
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

function searchCity() { // search for a city
    const searchValue = window.location.pathname.split('/').pop(); // get the search value from the URL
    getWeatherDataForFiveDays(searchValue); // get the weather data for the next five days
}     



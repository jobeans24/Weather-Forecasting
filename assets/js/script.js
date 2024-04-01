function searchButtonClicked() {
    var searchInput = document.getElementById('searchInput');
    var searchValue = searchInput.value;
    if (searchValue) {
        window.location.href = '/search/' + searchValue;
        storeCity(searchValue);
    }
    else {
        alert('Please enter a search term');
    }
}

function searchInputKeyPressed(event) {
    if (event.key === 'Enter') {
        searchButtonClicked();
    }
}

function getWeatherData(cityName) {
    const apiKey = '';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const city = data.name;
            const date = new Date(data.dt * 1000).toLocaleDateString();
            const weatherIcon = data.weather[0].icon;
            const temperature = data.main.temp;
            const windSpeed = data.wind.speed;
            const humidity = data.main.humidity;

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

            document.body.appendChild(weatherInfo);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

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

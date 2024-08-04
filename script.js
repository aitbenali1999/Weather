const apiKey = 'a6806d2ac9de7e20f27071cd6557078f'; // Replace with your actual API key

function getWeather() {
    const city = document.getElementById('cityInput').value.trim();

    if (city === '') {
        document.getElementById('weatherResult').innerHTML = '<p>Please enter a city name.</p>';
        return;
    }

    fetchWeather(city);
    fetchForecast(city);
}

function fetchWeather(city) {
    const apiUrl = `weather.php?city=${city}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherResult = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Temperature: ${data.main.temp} °C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                    <button onclick="saveFavorite('${data.name}')">Save to Favorites</button>
                `;
                document.getElementById('weatherResult').innerHTML = weatherResult;
            } else {
                document.getElementById('weatherResult').innerHTML = `<p>${data.error}</p>`;
            }
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = '<p>An error occurred while fetching weather data. Please try again later.</p>';
            console.error('Error fetching weather data:', error);
        });
}

function fetchForecast(city) {
    const apiUrl = `forecast.php?city=${city}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                let forecastResult = '<h2>5-Day Forecast</h2>';
                data.list.forEach(item => {
                    forecastResult += `
                        <p>
                            ${new Date(item.dt_txt).toLocaleString()}<br>
                            Temp: ${item.main.temp} °C<br>
                            Weather: ${item.weather[0].description}
                        </p>
                    `;
                });
                document.getElementById('forecastResult').innerHTML = forecastResult;
            } else {
                document.getElementById('forecastResult').innerHTML = `<p>${data.error}</p>`;
            }
        })
        .catch(error => {
            document.getElementById('forecastResult').innerHTML = '<p>An error occurred while fetching forecast data. Please try again later.</p>';
            console.error('Error fetching forecast data:', error);
        });
}

function saveFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        displayFavorites();
    }
}

function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    const favoriteList = document.getElementById('favoriteCities');
    favoriteList.innerHTML = '';
    favorites.forEach(city => {
        favoriteList.innerHTML += `<li>${city} <button onclick="removeFavorite('${city}')">Remove</button></li>`;
    });
}

function removeFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    favorites = favorites.filter(fav => fav !== city);
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    displayFavorites();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`location.php?lat=${lat}&lon=${lon}`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        document.getElementById('cityInput').value = data.name;
                        getWeather();
                    } else {
                        document.getElementById('weatherResult').innerHTML = `<p>${data.error}</p>`;
                    }
                })
                .catch(error => {
                    document.getElementById('weatherResult').innerHTML = '<p>An error occurred while fetching location data. Please try again later.</p>';
                    console.error('Error fetching location data:', error);
                });
        }, () => {
            document.getElementById('weatherResult').innerHTML = '<p>Unable to retrieve your location.</p>';
        });
    } else {
        document.getElementById('weatherResult').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

// Initialize favorites display
displayFavorites();

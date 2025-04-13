const apiKey = "3262aec225a0be7d86e0bc7c03d2bc85"; 
const forecastLimit = 5; 
let currentPage = 1;
let forecasts = [];

const loadingSpinner = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await fetchCityName(lat, lon); // Fetch city name using Nominatim
        }, (error) => {
            console.error("Error fetching location:", error);
            showError("Unable to retrieve your location. Please search for a city.");
        });
    } else {
        showError("Geolocation is not supported by this browser.");
    }
}

async function fetchCityName(lat, lon) {
    loadingSpinner.style.display = 'block';
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        if (!response.ok) throw new Error("Unable to retrieve city name. Please check your connection."); 
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village; 
        if (!city) throw new Error("City name not found. Please try a different location.");
        await fetchWeatherData(city); 
    } catch (error) {
        console.error("Error fetching city name:", error);
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none'; 
    }
}

async function fetchWeatherData(city) {
    loadingSpinner.style.display = 'block'; 
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("Weather data not found. Please check the city name."); // Check response
        const data = await res.json();
        updateWeatherUI(data); 
        await fetchForecastData(data.coord.lat, data.coord.lon); 
    } catch (error) {
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

let currentTemperatureCelsius = null;
let currentTemperatureFahrenheit = null;

function updateWeatherUI(data) {
    const { name, main, wind, weather } = data; 
    document.getElementById("city-name").innerText = name;


    currentTemperatureCelsius = main.temp;
    currentTemperatureFahrenheit = (main.temp * 9 / 5) + 32;

  
    document.getElementById("temperature").innerText = `${Math.round(currentTemperatureCelsius)}°C`;

    document.getElementById("humidity").innerText = `Humidity: ${main.humidity}%`; 
    document.getElementById("wind-speed").innerText = `Wind Speed: ${wind.speed} m/s`; 
    document.getElementById("weather-description").innerText = weather[0].description; 
    document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${weather[0].icon}.png`; 


    const weatherDetails = document.querySelectorAll('#city-name, #temperature, #humidity, #wind-speed, #weather-description, #weather-icon');
    weatherDetails.forEach(detail => {
        detail.classList.add('fade-in');
   
        void detail.offsetWidth; 
        detail.classList.add('visible');
    });
}


document.getElementById("search-button").addEventListener("click", async () => {
    const cityInput = document.getElementById("city-input").value.trim();
    if (cityInput) {
        await fetchWeatherDataByCity(cityInput);
    }
});


async function fetchWeatherDataByCity(city) {
    loadingSpinner.style.display = 'block'; 
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("Weather data not found. Please check the city name."); 
        const data = await res.json();
        updateWeatherUI(data); 
        await fetchForecastData(data.coord.lat, data.coord.lon); 
    } catch (error) {
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

async function fetchForecastData(lat, lon) {
    loadingSpinner.style.display = 'block'; 
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("Forecast data not found. Please try again later.");
        const data = await res.json();
        forecasts = data.list;
        renderForecasts();
        renderCharts(data.city.name);
    } catch (error) {
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none'; 
    }
}

function renderForecasts() {
    const forecastInfo = document.getElementById("forecast-info");
    forecastInfo.innerHTML = ''; 
    const start = (currentPage - 1) * forecastLimit;
    const end = start + forecastLimit;

    forecasts.slice(start, end).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(forecast.main.temp);
        const condition = forecast.weather[0];

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item", "fade-in");
        forecastItem.innerHTML = `
            <p>${time}</p>
            <p>Temp: ${temp}°C</p>
            <img src="http://openweathermap.org/img/wn/${condition.icon}.png" alt="${condition.description}">
        `;


        void forecastItem.offsetWidth; 
        forecastItem.classList.add('visible');

        forecastInfo.appendChild(forecastItem);
    });

    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = end >= forecasts.length;
}


let barChartInstance = null;
let doughnutChartInstance = null;
let lineChartInstance = null;

function renderCharts(cityName) {

    const temperatures = forecasts.slice(0, 5).map(f => f.main.temp);
    const weatherCounts = {};

    forecasts.forEach(forecast => {
        const condition = forecast.weather[0].main;
        weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
    });

    const weatherLabels = Object.keys(weatherCounts);
    const weatherData = Object.values(weatherCounts);

    if (barChartInstance) {
        barChartInstance.destroy();
    }
    if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
    }
    if (lineChartInstance) {
        lineChartInstance.destroy();
    }


    const barCtx = document.getElementById('barChart').getContext('2d');
    barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Now', 'Next 4 Hours', 'Next 8 Hours', 'Next 12 Hours', 'Next 16 Hours'],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            animations: {
                y: {
                    delay: (context) => context.index * 100,
                },
            },
        },
    });


    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    doughnutChartInstance = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: weatherLabels,
            datasets: [{
                label: 'Weather Conditions',
                data: weatherData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            animations: {
                animateScale: true,
                animateRotate: true,
            },
        },
    }
    
    );


    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Now', 'Next 4 Hours', 'Next 8 Hours', 'Next 12 Hours', 'Next 16 Hours'],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true,
                },
            },
        },
    });
}


document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderForecasts();
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage * forecastLimit < forecasts.length) {
        currentPage++;
        renderForecasts();
    }
});


function showError(message) {
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000); 
}


getLocation();

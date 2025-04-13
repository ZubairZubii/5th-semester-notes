document.getElementById("search-button").addEventListener("click", function() {
    const city = document.getElementById("city-input").value;
    if (city) {
        getWeatherData(city);
        getForecastData(city);
    }
});


const weatherApiKey = "3262aec225a0be7d86e0bc7c03d2bc85";
const geminiApiKey = "AIzaSyDCBvNqyWWej-m5YnsEmqvhyFNZZC_E8OY";

import { GoogleGenerativeAI } from "@google/generative-ai";

document.addEventListener('DOMContentLoaded', function () {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeButton = document.getElementById('close-button');
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    const countryInput = document.getElementById('country-input');
    const answerArea = document.getElementById('answer-area');

    chatbotIcon.addEventListener('click', function () {
        clearAnswerArea();
        chatbotModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        chatbotModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === chatbotModal) {
            chatbotModal.style.display = 'none';
        }
    });

    sendButton.addEventListener('click', function () {
        const query = chatInput.value.trim();
        const country = countryInput.value.trim();

        if (query) {
            displayAnswer(query, true);
            handleUserQuery(query, country);
            chatInput.value = "";
            countryInput.value = "";
        }
    });


 function handleUserQuery(query, country) {
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery.includes("table")) {
       
        getTableDataAndGeminiResponse(query);
    } else {
        const weatherKeywords = ["weather", "temperature", "humidity", "forecast", "wind", "rain", "snow", "storm", "sun", "cloud", "clear sky"];
        const isWeatherRelated = weatherKeywords.some(keyword => lowerCaseQuery.includes(keyword));

        if (isWeatherRelated) {
            getWeatherAndGeminiResponse(query, country);
        } else {
            displayAnswer("I only respond to weather-related queries or table data. Please ask about the weather or forecast table.", false);
        }
    }
}



   function getTableDataAndGeminiResponse(query) {
    const forecastData = getCurrentForecastTableData();
    
    if (forecastData.length > 0) {
        const prompt = `${query}. Here is the forecast data from the table: ${forecastData}`;
        getGeminiResponse(query, prompt);
    } else {
        displayAnswer("No forecast data available in the table.", false);
    }
}


   function getCurrentForecastTableData() {
    const tableBody = document.querySelector("#forecast-table tbody");
    const rows = tableBody.querySelectorAll("tr");
    const forecastData = [];

    rows.forEach(row => {
        const columns = row.querySelectorAll("td");
        const date = columns[0].innerText;
        const temp = columns[1].innerText;
        const description = columns[2].innerText;
        const icon = columns[3].querySelector("img").alt;
        forecastData.push(`Date: ${date}, Temp: ${temp}, Description: ${description}, Icon: ${icon}`);
    });

    return forecastData.join(", ");
}



    function getWeatherAndGeminiResponse(query, country) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${weatherApiKey}`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherInfo = `Current weather in ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C, humidity ${data.main.humidity}%, wind speed ${data.wind.speed} m/s.`;
                    getGeminiResponse(query, weatherInfo);
                } else {
                    displayAnswer("Country not found. Please try again.", false);
                }
            })
            .catch(error => {
                displayAnswer("Error fetching weather data. Please try again.", false);
            });
    }

    function getGeminiResponse(query, weatherInfo) {
        const prompt = `${query}. Here is the current weather data for the location: ${weatherInfo}`;

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        model.generateContent(prompt)
            .then(result => {
                const geminiResponse = cleanResponse(result.response.text());
                displayAnswer(geminiResponse, false);
            })
            .catch(error => {
                displayAnswer("Error fetching response from Gemini API. Please try again.", false);
            });
    }


    function cleanResponse(response) {
        return response.replace(/[*]/g, "").replace(/\n/g, "<br>").trim();
    }


    function displayAnswer(answer, isUser = false) {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('chatbot-answer', isUser ? 'user' : 'bot');

        const timestamp = new Date().toLocaleTimeString();
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('timestamp');
        timeDiv.innerText = timestamp;

        answerDiv.innerHTML = answer; 
        answerDiv.appendChild(timeDiv);
        answerArea.appendChild(answerDiv);
    }


    function clearAnswerArea() {
        answerArea.innerHTML = '';
    }
});


function getWeatherData(city) {
    const apiKey = weatherApiKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;


    document.getElementById("loading").style.display = "block";

    fetch(url)
        .then(response => response.json())
        .then(data => {
         
            document.getElementById("loading").style.display = "none";
            if (data.cod === 200) {
                updateWeatherDetails(data); 
                getForecastData(city); 
            } else {
                alert("City not found!");
            }
        })
        .catch(error => {
      
            document.getElementById("loading").style.display = "none";
            console.error('Error fetching the weather data:', error);
        });
}



let currentPage = 1;
const itemsPerPage = 6; 
let forecastList = [];


function getForecastData(city) {
    const apiKey = weatherApiKey; 
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;


    document.getElementById("loading").style.display = "block";

    fetch(url)
        .then(response => response.json())
        .then(data => {
         
            document.getElementById("loading").style.display = "none";
            if (data.cod === "200") {
                forecastList = data.list;
                updateForecastTable(); 
            } else {
                alert("Forecast data not found for this city.");
            }
        })
        .catch(error => {
    
            document.getElementById("loading").style.display = "none";
            console.error('Error fetching the forecast data:', error);
        });
}

function updateForecastTable(filteredList = forecastList) {
    const tableBody = document.querySelector("#forecast-table tbody");
    tableBody.innerHTML = ''; 

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    
  
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentForecasts = filteredList.slice(start, end);

    currentForecasts.forEach(forecast => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(forecast.dt * 1000).toLocaleDateString()}</td>
            <td>${forecast.main.temp}°C</td>
            <td>${forecast.weather[0].description}</td>
            <td><img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}"></td>
        `;
        

        row.addEventListener('click', () => {
            updateWeatherDetails(forecast);
        });
        
        tableBody.appendChild(row);
    });

    createPaginationControls(totalPages);
}


function updateWeatherDetails(forecast) {
    const humidity = forecast.main.humidity; 
    const windSpeed = forecast.wind.speed; 
    const currentConditions = forecast.weather[0].description; 
    const selectedDate = new Date(forecast.dt * 1000); 

    document.getElementById("city-name").innerText = forecast.name; 
    document.getElementById("humidity").innerText = `${humidity}%`;
    document.getElementById("wind-speed").innerText = `${windSpeed} m/s`;
    document.getElementById("current-conditions").innerText = currentConditions;
    document.getElementById("selected-date").innerText = selectedDate.toLocaleString();
}


function createPaginationControls(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ''; 

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-button');
        

        button.addEventListener('click', () => {
            currentPage = i; 
            updateForecastTable(); 
        });

        paginationContainer.appendChild(button);
    }
}



document.getElementById("sort-asc").addEventListener("click", function() {
    const sortedList = [...forecastList].sort((a, b) => a.main.temp - b.main.temp);
    currentPage = 1;
    updateForecastTable(sortedList);
});


document.getElementById("sort-desc").addEventListener("click", function() {
    const sortedList = [...forecastList].sort((a, b) => b.main.temp - a.main.temp);
    currentPage = 1;
    updateForecastTable(sortedList);
});


document.getElementById("filter-rain").addEventListener("click", function() {
    const filteredList = forecastList.filter(forecast => forecast.weather[0].description.includes("rain"));
    currentPage = 1; 
    updateForecastTable(filteredList);
});


document.getElementById("highest-temp").addEventListener("click", function() {
    const highestTempForecast = forecastList.reduce((max, forecast) => max.main.temp > forecast.main.temp ? max : forecast);
    updateForecastTable([highestTempForecast]); 
});

getWeatherData("Islamabad");

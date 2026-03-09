const apiKey = "ff863fa4c176ecb2094924477b081c39";

const weatherCard = document.getElementById("weatherCard");
const forecastContainer = document.getElementById("forecast");
const loader = document.getElementById("loader");

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

function setBackground(condition) {
    document.body.className = "";

    if (condition.includes("clear")) {
        document.body.classList.add("sunny");
    } else if (condition.includes("cloud")) {
        document.body.classList.add("cloudy");
    } else if (condition.includes("rain")) {
        document.body.classList.add("rainy");
    } else {
        document.body.classList.add("night");
    }
}

function displayWeather(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("temperature").innerText = `${data.main.temp}°C`;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    setBackground(data.weather[0].main.toLowerCase());

    weatherCard.style.display = "block";
}

function displayForecast(data) {
    forecastContainer.innerHTML = "";

    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyData.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });

        const card = `
            <div class="forecast-card">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${day.main.temp}°C</p>
            </div>
        `;
        forecastContainer.innerHTML += card;
    });
}

function getWeatherByCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) return alert("Enter city name");

    showLoader();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            displayWeather(data);
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        })
        .then(res => res.json())
        .then(data => {
            displayForecast(data);
            hideLoader();
        })
        .catch(() => {
            alert("Error fetching data");
            hideLoader();
        });
}

function getWeatherByLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        showLoader();

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                displayWeather(data);
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
            })
            .then(res => res.json())
            .then(data => {
                displayForecast(data);
                hideLoader();
            })
            .catch(() => {
                alert("Error fetching location weather");
                hideLoader();
            });
    });
}

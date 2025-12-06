async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return alert("Please enter a city!");

    try {
        // 1️⃣ Get latitude and longitude
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
        const geoRes = await fetch(geoURL);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found!");
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // 2️⃣ Get weather using coordinates
        const weatherURL = `
            https://api.open-meteo.com/v1/forecast?
            latitude=${latitude}&longitude=${longitude}
            &current_weather=true
            &daily=temperature_2m_max,temperature_2m_min,weathercode
            &timezone=auto
        `.replace(/\s+/g, "");

        const weatherRes = await fetch(weatherURL);
        const weather = await weatherRes.json();

        // 3️⃣ Update current weather
        document.getElementById("cityName").innerText = name;
        document.getElementById("temperature").innerText =
            weather.current_weather.temperature + "°C";
        document.getElementById("description").innerText =
            "Wind: " + weather.current_weather.windspeed + " km/h";
        document.getElementById("humidity").innerText =
            "Timezone: " + weather.timezone;
        document.getElementById("wind").innerText = "";

        document.getElementById("icon").src =
            "https://cdn-icons-png.flaticon.com/512/869/869869.png";

        document.getElementById("weatherInfo").classList.remove("hidden");

        // 4️⃣ Show 5-day forecast
        showForecast(weather.daily);

    } catch (err) {
        console.error(err);
        alert("Error fetching data.");
    }
}

function showForecast(daily) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        forecastDiv.innerHTML += `
            <div class="forecast-day">
                <h4>${daily.time[i]}</h4>
                <p>Max: ${daily.temperature_2m_max[i]}°C</p>
                <p>Min: ${daily.temperature_2m_min[i]}°C</p>
            </div>
        `;
    }

    document.getElementById("forecastTitle").classList.remove("hidden");
    forecastDiv.classList.remove("hidden");
}

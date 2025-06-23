const cityLabel = document.querySelector(".label_city");
const dateTimeLabel = document.querySelector(".label_datetime");
const conditionLabel = document.querySelector(".label_condition");
const iconDisplay = document.querySelector(".icon_display");
const tempLabel = document.querySelector(".label_temp");
const tempLow = document.querySelector(".temp_low");
const tempHigh = document.querySelector(".temp_high");

const feelsLikeVal = document.querySelector(".value_feels");
const humidityVal = document.querySelector(".value_humidity");
const windVal = document.querySelector(".value_wind");
const pressureVal = document.querySelector(".value_pressure");

const searchForm = document.querySelector(".form_lookup");

// Convert country code to full name
const getCountryName = (code) => {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
};


const formatDateTime = (dt) => {
  const date = new Date(dt * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const clearValues = () => {
  dateTimeLabel.innerHTML = "--";
  conditionLabel.innerHTML = "--";
  iconDisplay.innerHTML = "";
  tempLabel.innerHTML = "--";
  tempLow.innerHTML = "--";
  tempHigh.innerHTML = "--";
  feelsLikeVal.innerHTML = "--";
  humidityVal.innerHTML = "--";
  windVal.innerHTML = "--";
  pressureVal.innerHTML = "--";
  document.body.className = ""; 
};

let city = "";

// On form submit
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.querySelector(".input_location");
  if (!input.value.trim()) return;

  city = input.value.trim();
  fetchWeather();

  input.value = "";
});

const fetchWeather = async () => {
  const apiKey = "837fa4aa94ea9437d279ba006b7f6484";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      cityLabel.innerHTML = "City not found";
      clearValues();
      return;
    }

    const { main, name, weather, wind, sys, dt } = data;

    const condition = weather[0].main.toLowerCase();
    document.body.className = "";
    document.body.classList.add(condition);

    const kToC = (k) => (k - 273.15).toFixed(1);

    cityLabel.innerHTML = `${name}, ${getCountryName(sys.country)}`;
    dateTimeLabel.innerHTML = formatDateTime(dt);

    conditionLabel.innerHTML = weather[0].main;
    iconDisplay.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="${weather[0].description}" />`;

    tempLabel.innerHTML = `${kToC(main.temp)}&#176;C`;
    tempLow.innerHTML = `Min: ${kToC(main.temp_min)}&#176;C`;
    tempHigh.innerHTML = `Max: ${kToC(main.temp_max)}&#176;C`;

    feelsLikeVal.innerHTML = `${kToC(main.feels_like)}&#176;C`;
    humidityVal.innerHTML = `${main.humidity}%`;
    windVal.innerHTML = `${wind.speed} m/s`;
    pressureVal.innerHTML = `${main.pressure} hPa`;

  } catch (err) {
    console.error("Weather fetch error:", err);
    cityLabel.innerHTML = "City not found";
    clearValues();
  }
};


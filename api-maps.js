let map;
let marker;
let autocomplete;
const colCords = { lat: 4.8, lng: -75.6 };
const input = document.getElementById("autocomplete");

const initMap = async () => {
  try {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
      center: colCords,
      zoom: 8
    });

    marker = new google.maps.Marker({
      position: colCords,
      map: map
    });

    initAutocomplete();
  } catch (error) {
    console.error("Error initializing the map:", error);
  }
};

const initAutocomplete = () => {
  autocomplete = new google.maps.places.Autocomplete(input, { types: ["(cities)"] });
  autocomplete.addListener("place_changed", onPlaceChanged);
};

const onPlaceChanged = async () => {
  const place = autocomplete.getPlace();

  if (!place.geometry) {
    document.getElementById("autocomplete").placeholder = "Enter a city";
  } else {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    map.setCenter(place.geometry.location);
    map.setZoom(10);
    marker.setPosition(place.geometry.location);
    await fetchWeatherData(lat, lng);
  }
};

/*----------API WEATHER----------------*/
/*API KEY: cc939e3f3efda3cc6426e565bbf7c1d2*/ 
const kelvin = 273.15;

const fetchWeatherData = async (lat, lon) => {
  const APIkey = 'cc939e3f3efda3cc6426e565bbf7c1d2';
  const url_base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;

  try {
    const response = await fetch(url_base);
    const data = await response.json();

    console.log("Weather data:", data);

    showWeatherModal(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const showWeatherModal = (data) => {
  const modal = document.getElementById("weatherModal");
  const icon = modal.querySelector('.icon');
  const temp = modal.querySelector('.temp');
  const summary = modal.querySelector('.summary');
  const location = modal.querySelector('.location');

  temp.textContent = Math.floor(data.main.temp - kelvin) + "°C";
  summary.textContent = data.weather[0].description;
  location.textContent = data.name + "," + data.sys.country;

  modal.style.display = "block";

  const closeModal = modal.querySelector('.close');
  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};

window.addEventListener('load', initMap);

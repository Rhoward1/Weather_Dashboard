var searchEl = document.querySelector('#user-form')
var searchedCity = document.querySelector('.form-input')
var searchBtn = document.querySelector('.search-btn')
var currentWeatherEl = document.querySelector('#current');
var forecastWeatherEl = document.querySelector('#forecast')
var cityList = document.querySelector('.list-group')

var cityHistory = [];

// display items in searchlist

function displayCityHistory() {
    
    cityList.innerHTML = "";

 // loop to build list for previous search history   
    for (var i = 0; i < cityHistory.length; i++) {
        var cityHistorySearch = cityHistory[i];

        var li = document.createElement('li');
        li.classList.add('custom-li')
        li.textContent = cityHistorySearch;
        li.setAttribute('data-index', i);
        cityList.appendChild(li);   
    }

  // event listener to make list function 

    cityList.addEventListener('click', function(event){     
        console.log(event)
        var element = event.target;

        
        if(element.matches('li') === true) {
            console.log(element.innerHTML)
            var historyCity = element.innerHTML
            
            getAPI(historyCity)
        }
    })

}

//grabs list from local storage when page loads

function getCityHistory() {
    
    var storedCities = JSON.parse(localStorage.getItem('cityHistory'))

     
    if(storedCities !== null) {
        cityHistory = storedCities
    }

    displayCityHistory();
}


function storeCities() {
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
}

// event listener for search submitfunction

searchEl.addEventListener('submit', function(event){
    console.log(event)
    event.preventDefault();
    var city = searchedCity.value;

    getAPI(city);

    
    cityHistory.push(city);
    searchedCity.value = "";

    
    if(cityHistory.length > 7) {
        cityHistory.shift();
    }

    
    storeCities();
    displayCityHistory();

});

// function to display the current weather section

function displayCurrentWeather(name, resultObject) {
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-dark', 'text-light', 'm-1', 'p-0'); 

    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    var titleEl = document.createElement('h3');
    var day = moment.unix(resultObject.daily[0].dt);
    titleEl.textContent = name + ' (' + day.format("M/D/YYYY") + ')'
    
    console.log(name);

    var iconEl = document.createElement('img');
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + resultObject.current.weather[0].icon + "@2x.png")

    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML = '<strong>Temperature:</strong> ' + resultObject.current.temp + ' °F' + '<br/>';
    bodyContentEl.innerHTML += '<strong>Humidity:</strong> ' + resultObject.current.humidity + "%"+ '<br/>';
    bodyContentEl.innerHTML += '<strong>Wind:</strong> ' + resultObject.current.wind_speed + " MPH"+ '<br/>';
// adds color change to uv Index
    var uvText = document.createElement('p');
    var uvEl = document.createElement('span');
    var uvIndex = uvEl.textContent = resultObject.current.uvi
    uvText.innerHTML = "<strong>UV index:</strong> "
    uvText.append(uvEl)
    bodyContentEl.append(uvText)

    if (uvIndex < 3) {
        uvEl.classList.add('low-uv')
    } else if (uvIndex >= 3 && uvIndex < 8) {
        uvEl.classList.add('medium-uv')
    } else {
        uvEl.classList.add('high-uv')
    }

    resultBody.append(titleEl, iconEl, bodyContentEl);

    currentWeatherEl.append(resultCard);
}

// function to display daily forecast on cards
function displayForecastWeather(resultObject) {

// loop to build cards for daily forecast    
    for (var i = 1; i < 6; i++) {
        var resultColumn = document.createElement('div');
        resultColumn.classList.add('col-md-2.5','m-auto');

        var resultCard = document.createElement('div');
        resultCard.classList.add('card', 'bg-dark', 'text-light',); 
        resultColumn.append(resultCard)

        var resultBody = document.createElement('div');
        resultBody.classList.add('card-body');
        resultCard.append(resultBody)

        var titleEl = document.createElement('h4');
        var day = moment.unix(resultObject.daily[i].dt);
        titleEl.textContent = day.format("M/D/YYYY")

        var iconEl = document.createElement('img');
        iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + resultObject.daily[i].weather[0].icon + "@2x.png")

        var bodyContentEl = document.createElement('p');
        bodyContentEl.innerHTML = '<strong>Temperature:</strong> ' + resultObject.daily[i].temp.day + ' °F' + '<br/>';
        bodyContentEl.innerHTML += '<strong>Humidity:</strong> ' + resultObject.daily[i].humidity + "%"+ '<br/>';
        bodyContentEl.innerHTML += '<strong>Wind:</strong> ' + resultObject.daily[i].wind_speed + " MPH"+ '<br/>';
        resultBody.append(titleEl, iconEl, bodyContentEl);

        forecastWeatherEl.append(resultColumn)

    }
}

//Function to call the openweather API and get the city name, lat and long

function getAPI(cityID) {
    var key = 'f56d1776328f8889a900d590d64b46a9';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityID+ '&units=imperial&&appid=' + key)
    .then(function(response){return response.json()}) 
    .then(function(data) {
        console.log(data)
        getWeatherAPI(data.name ,data.coord.lat, data.coord.lon)
    })

   
}



function getWeatherAPI(name, lat, lon) {
    var key = 'f56d1776328f8889a900d590d64b46a9';
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly,alerts&appid=' + key)
    .then(function(response){return response.json()})
    .then(function(data){
        console.log(data)
        currentWeatherEl.textContent = '';
        forecastWeatherEl.textContent = '';
        displayCurrentWeather(name, data)
        displayForecastWeather(data)
    })
 
}



getCityHistory();






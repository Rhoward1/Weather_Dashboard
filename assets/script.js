// display items in searchlist
//for loop to create forcast cards

var searchEl = document.querySelector('#user-form')
var searchedCity = document.querySelector('.form-input')
var searchBtn = document.querySelector('.search-btn')
var currentWeatherEl = document.querySelector('#current');
var forecastWeatherEl = document.querySelector('#forecast')
var cityList = document.querySelector('.list-group')

var cityHistory = [];


function displayCityHistory() {
    
    cityList.innerHTML = "";

    
    for (var i = 0; i < cityHistory.length; i++) {
        var cityHistorySearch = cityHistory[i];

        var li = document.createElement('li');
        li.classList.add('custom-li')
        li.textContent = cityHistorySearch;
        li.setAttribute('data-index', i);
        cityList.appendChild(li);   
    }

    
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


function init() {
    
    var storedCities = JSON.parse(localStorage.getItem('cityHistory'))

     
    if(storedCities !== null) {
        cityHistory = storedCities
    }

    displayCityHistory();
}


function storeCities() {
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
}


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








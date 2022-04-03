// display items in searchlist
//for loop to create forcast cards

var searchEl = document.querySelector('#user-form')
var searchedCity = document.querySelector('.form-input')
var searchBtn = document.querySelector('.search-btn')
var currentWeatherEl = document.querySelector('current')
var forecastWeatherEl = document.querySelector('#forecast')
var cityList = document.querySelector('.list-group')


var cityHistory = [];

function displayCityHistory(){

    cityList.innerHTML = "";

    for (var i = 0; i < cityHistory.length; i++) {
        cityHistorySearched = cityHistory[i];

        var li = document.createElement('li')
        li.classList.add('custom-li')
        li.textContent = cityHistorySearched;
        li.setAttribute('data-index',i);
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

// searchEl.addEventListener('submit', function(event){
//     console.log(event)
//     event.preventDefault();
//     var city = searchedCity.value;

// }





















































































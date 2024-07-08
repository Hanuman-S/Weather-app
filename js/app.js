//Detects the city and returns its latitude and longitude
let input = document.querySelector('#city');
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        let city = input.value;
        console.log(city);
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/geocoding?city=' + city,
            headers: { 'X-Api-Key': '8ABaxWRkXFm80cyyUtd1GQ==4RL00eNFtioVGugD'},
            contentType: 'application/json',
            success: function(result) {
                console.log(result);
                let URL =`https://api.tomorrow.io/v4/weather/forecast?location=${result[0].latitude},${result[0].longitude}&apikey=wXuwaN2pp65WVmgjWBOg1Gh8Qbof4Wl8`;
                getInfo(URL,result[0].name,result[0].state,result[0].country);
            },  
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }
});

//Gets info
async function getInfo(URL,city,state,country){
    let response = await fetch(URL);
    let weatherInfo = await response.json();
    console.log(weatherInfo);
    checkWeather(weatherInfo);
    output(weatherInfo,city,state,country);
}

//Displays output
let cityName = document.querySelector('#cityName');
let avgTemp = document.querySelector('#avgTemp');
let appTemp = document.querySelector('#apparentTemp');
let maxTemp = document.querySelector('#maxTemp');
let minTemp = document.querySelector('#minTemp');
let humidity = document.querySelector('#humidity');
let wind = document.querySelector('#wind');
let pressure = document.querySelector('#pressure');
function output(weatherInfo,city,state,country){
    cityName.textContent = `${city} , ${state} , ${country}`;
    avgTemp.textContent=Math.round(weatherInfo.timelines.daily[0].values.temperatureAvg) + '°';
    appTemp.textContent='Feels like ' + Math.round(weatherInfo.timelines.daily[0].values.temperatureApparentAvg) + '°';
    maxTemp.textContent=Math.round(weatherInfo.timelines.daily[0].values.temperatureMax) + '°';
    minTemp.textContent=Math.round(weatherInfo.timelines.daily[0].values.temperatureMin) + '°';
    humidity.textContent=Math.round(weatherInfo.timelines.daily[0].values.humidityAvg) + '%';
    wind.textContent=Math.round(weatherInfo.timelines.daily[0].values.windSpeedAvg) + 'mph ' + windDirec(weatherInfo) ;
    pressure.textContent=Math.round(weatherInfo.timelines.daily[0].values.pressureSurfaceLevelAvg) + 'hPa';
}

//Checks the weather and displays output
let icon = document.getElementById('icon');
let iconText = document.getElementById('iconText');
let nowWeatherBG = document.getElementById('nowWeather');
function checkWeather(weatherInfo){
    if(weatherInfo.timelines.daily[0].values.precipitationProbabilityAvg>35 && weatherInfo.timelines.daily[0].values.humidityAvg>70){
        icon.setAttribute('class','fa-solid fa-cloud-rain');
        iconText.textContent = 'Rainy';
        nowWeatherBG.style.backgroundImage = 'linear-gradient(rgba(121, 90, 157, 0.757),rgb(67, 10, 135))';
    } else if(weatherInfo.timelines.daily[0].values.windSpeedAvg>21){
        icon.setAttribute('class',"fa-solid fa-wind");
        iconText.textContent = 'Windy';
        nowWeatherBG.style.backgroundImage = 'linear-gradient(rgba(190, 192, 194, 0.767),slategrey)'
    } else if(weatherInfo.timelines.daily[0].values.cloudCoverAvg<60 && weatherInfo.timelines.daily[0].values.cloudCoverAvg>30){
        icon.setAttribute('class','fa-solid fa-cloud-sun');
        iconText.textContent = 'Party Cloudy';
        nowWeatherBG.style.backgroundImage = 'linear-gradient(lightblue,rgba(16, 130, 230, 0.842))';
    } else if(weatherInfo.timelines.daily[0].values.cloudCoverAvg>70){
        icon.setAttribute('class','fa-solid fa-cloud');
        iconText.textContent = 'Cloudy';
        nowWeatherBG.style.backgroundImage = "linear-gradient(rgba(95, 78, 138, 0.777),rgb(65, 25, 166))";
    } else {
        icon.setAttribute('class','fa-solid fa-sun');
        iconText.textContent = 'Clear Sky';
        nowWeatherBG.style.backgroundImage = "linear-gradient(rgba(255, 255, 0, 0.832),rgba(255, 166, 1, 0.935))";
    }
}

//Checks the win direction
function windDirec(weatherInfo){
    if(weatherInfo.timelines.daily[0].values.windDirectionAvg>10 && weatherInfo.timelines.daily[0].values.windDirectionAvg<80){
        return 'NE';
    } else if(weatherInfo.timelines.daily[0].values.windDirectionAvg>100 && weatherInfo.timelines.daily[0].values.windDirectionAvg<170){
        return 'SE';
    } else if(weatherInfo.timelines.daily[0].values.windDirectionAvg>190 && weatherInfo.timelines.daily[0].values.windDirectionAvg<260){
        return 'SW';
    } else if(weatherInfo.timelines.daily[0].values.windDirectionAvg>280 && weatherInfo.timelines.daily[0].values.windDirectionAvg<350){
        return 'NW';
    } else if(weatherInfo.timelines.daily[0].values.windDirectionAvg<=10 || weatherInfo.timelines.daily[0].values.windDirectionAvg>=350){
        return 'N';
    } else if(weatherInfo.timelines.daily[0].values.windDirectionAvg<=100 &&weatherInfo.timelines.daily[0].values.windDirectionAvg>=80){
        return 'E';
    } else if(weatherInfo.timelines.daily[0].values.windDirectionAvg<=190 && weatherInfo.timelines.daily[0].values.windDirectionAvg>=170){
        return 'S';
    } else if(weatherInfo.timelines.daily[0].values.windDirectionAvg<=280 && weatherInfo.timelines.daily[0].values.windDirectionAvg>=260){
        return 'W';
    }
}
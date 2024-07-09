//Detects the city and returns its latitude and longitude
let input = document.getElementById('city');

input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        let str = `${input.value}`;
        let comma = str.indexOf(',');
        let city = str.substring(0,comma);
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

//Dropdown search bar to select cities
input.addEventListener('input',cityDropdown);
async function cityDropdown(){
    let str = `${input.value}`;
    if(str.length==3 || str.length==4){
        let url = `https://city-and-state-search-api.p.rapidapi.com/cities/search?q=${input.value}`;
        let options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '0c68cfc138msha7069ac7906a59cp1789d1jsnb1ebd19f8630',
                'x-rapidapi-host': 'city-and-state-search-api.p.rapidapi.com'
            }
        };
    
        try {
            let response = await fetch(url, options);
            let result = await response.json();
            dropdown(result);
            addClick();
            
        } catch (error) {
            console.error(error);
        }
    } else if(str.length>4){
        filterFunction(str);
        addClick();
    } else {
        reset();
        console.log('number of char is very less');
    }
}

//Creates the dropdown list and displays it
let dropdownList = document.getElementById('dropdownList');
function dropdown(arr){
    dropdownList.innerText = null;
    for(obj of arr){
        let el = document.createElement('p')
        el.setAttribute('class','listElement');
        el.innerText = `${obj.name}, ${obj.state_name}, ${obj.country_name}`;
        dropdownList.appendChild(el);
    }
}

//Filter Function 
function filterFunction(str){
    let listItems = document.getElementsByClassName('listElement');
    for(item of listItems){
        let txtVal = item.innerText;
        if(txtVal.toUpperCase().indexOf(str.toUpperCase())>-1){
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    }
}

//Reset function makes the list to null
function reset(){
    dropdownList.innerText=null;
}

//On clicking one of the list items the input value should display the item
function addClick(){
    let listItems = document.getElementsByClassName('listElement')
    for(let i=0;i<listItems.length;i++){
        listItems[i].addEventListener('click',()=>{
            input.value = listItems[i].innerText;
            filterFunction(`${input.value} `);
            let str = `${input.value}`;
            let comma = str.indexOf(',');
            let city = str.substring(0,comma);
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
        })
    }
}

//Gets info
async function getInfo(URL,city,state,country){
    let response = await fetch(URL);
    let weatherInfo = await response.json();
    console.log(weatherInfo);
    checkWeather(weatherInfo);
    output(weatherInfo,city,state,country);
    daysForecast.innerText = '';
    extendedForecast(weatherInfo);
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

//Extended Forecast
let daysForecast = document.getElementById('daysForecast');
function extendedForecast(weatherInfo){
    for(let i=1;i<6;i++){
        let oneDayForecast = document.createElement('section');
        oneDayForecast.setAttribute('class','oneDayForecast');
        let oneDayForecastDate = document.createElement('section');
        oneDayForecastDate.setAttribute('class','date');
        let oneDayForecastExtendedIcon = document.createElement('section');
        oneDayForecastExtendedIcon.setAttribute('class','extendedIcon');
        let oneDayForecastDayWord = document.createElement('section');
        oneDayForecastDayWord.setAttribute('class','dayWord');
        let oneDayForecastTempChange = document.createElement('section');
        oneDayForecastTempChange.setAttribute('class','tempChange');

        oneDayForecastDate.innerText = dayFinder(weatherInfo.timelines.daily[i].time.slice(0,10));
        checkExtendedWeather(weatherInfo.timelines.daily[i].values,oneDayForecastExtendedIcon,oneDayForecastDayWord);
        oneDayForecastTempChange.innerText = `${Math.round(weatherInfo.timelines.daily[i].values.temperatureMax)}° | ${Math.round(weatherInfo.timelines.daily[i].values.temperatureMin)}°`;

        oneDayForecast.appendChild(oneDayForecastDate);
        oneDayForecast.appendChild(oneDayForecastExtendedIcon);
        oneDayForecast.appendChild(oneDayForecastDayWord);
        oneDayForecast.appendChild(oneDayForecastTempChange);

        daysForecast.append(oneDayForecast);
    }
}

//Checks the weather for extended Forecast
function checkExtendedWeather(weatherInfo,oneDayForecastExtendedIcon,oneDayForecastDayWord){
    if(weatherInfo.precipitationProbabilityAvg>35 && weatherInfo.humidityAvg>70){
        let EIcon = document.createElement('i');
        EIcon.setAttribute('class','fa-solid fa-cloud-rain');
        oneDayForecastExtendedIcon.append(EIcon);
        oneDayForecastDayWord.innerText = 'Rainy' 
    } else if(weatherInfo.windSpeedAvg>21){
        let EIcon = document.createElement('i');
        EIcon.setAttribute('class','fa-solid fa-wind');
        oneDayForecastExtendedIcon.append(EIcon);
        oneDayForecastDayWord.innerText = 'Windy';
    } else if(weatherInfo.cloudCoverAvg<60 && weatherInfo.cloudCoverAvg>30){
        let EIcon = document.createElement('i');
        EIcon.setAttribute('class','fa-solid fa-cloud-sun');
        oneDayForecastExtendedIcon.append(EIcon);
        oneDayForecastDayWord.innerText = 'Party Cloudy';
    } else if(weatherInfo.cloudCoverAvg>70){
        let EIcon = document.createElement('i');
        EIcon.setAttribute('class','fa-solid fa-cloud');
        oneDayForecastExtendedIcon.append(EIcon);
        oneDayForecastDayWord.innerText = 'Cloudy';
    } else {
        let EIcon = document.createElement('i');
        EIcon.setAttribute('class','fa-solid fa-sun');
        oneDayForecastExtendedIcon.append(EIcon);
        oneDayForecastDayWord.innerText = 'Clear Sky';
    }
}

//Finds the day 
function dayFinder(date){
    let now = new Date(date);
    let day = now.getDay();
    let dayArr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return dayArr[day];
}
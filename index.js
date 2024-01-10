const searchBarElement = document.getElementById("search-bar");
const searchButtonElement = document.getElementById("search-button");
const baseGeoURL = "https://geocoding-api.open-meteo.com/v1/search";
const baseForecastURL = "https://api.open-meteo.com/v1/forecast";
const rainQuery = "&hourly=temperature_2m,precipitation_probability&forecast_days=1";
let componetsArr = []

searchBarElement.addEventListener("keypress", function(event){
    if (event.key == "Enter") {
        event.preventDefault();
        searchButtonElement.click();
        searchBarElement.blur()
    }
}) 

function getValue() {
    if (searchBarElement.value != "") {
        // console.log(searchBarElement.value)
        btnClick(searchBarElement.value)
    } else {
        console.log("Ta Vazio Praga!")
    } 
}

const urlRequest = async (url) => {
    const data = await fetch(url).then(res => res.json())
    return data
}

async function fetchLocalCoordinate(localName)  {
    let localNameThreated = localName.replace(/ +/g, '+')
    const url = baseGeoURL + "?name=" + localNameThreated + "&count=5&language=pt&format=json"
    const data = await urlRequest(url);
    return data.results
}

async function fetchLocalClimate(obj) {
    let lat, long
    [lat,long] = [obj.latitude, obj.longitude]
    const url = baseForecastURL + "?latitude=" + lat + "&longitude=" + long + rainQuery
    const forecastObj = await urlRequest(url)
    await console.log(forecastObj)
    createCardComponent(obj.name, Math.max(...forecastObj.hourly.precipitation_probability))
}

const btnClick = async (localName) => {
    const localObj = await fetchLocalCoordinate(localName);
    localObj != undefined ? await fetchLocalClimate(localObj[0]) : console.log("Local Nao Encontrado");
    searchBarElement.value = "";
}

const createCardComponent= (name, forecast) => {
    const container = document.getElementById('response');
    const thePhrase = phrase(Number(forecast));
    const cardComponent = `
    <h3 class="response-title">${name}</h3>
    <h3 class="forecast">${forecast}% de chance de chuva</h3>
<p>
    ${thePhrase}
</p>
`
    container.innerHTML = cardComponent
    container.classList.remove('hidden')
}

function phrase(percent) {
    if (percent > 50 && percent < 80) {
        return "Acho melhor voce levar um guarda-chuva se for sair, melhor prevenir do que remediar."
    } 
    if (percent < 50) {
        return "O Tempo parece ok! Pode sair de casa sem medo de ser feliz."
    }
    else {
        return "Vai chover mofi!! Nao esqueca o guarda-chuva!"
    }
}



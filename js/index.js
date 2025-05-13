
import { getCurrentWeather, getFiveDayForecast } from './weatherApi.js';
import { API_KEY, BASE_URL } from './weather-config.js';

console.log("API_KEY:", API_KEY);
console.log("BASE_URL:", BASE_URL);

function updateTime() {
  const time = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const formattedTime = time.toLocaleTimeString('pt-BR', options);
  document.getElementById("time").textContent = formattedTime;
}

function updateDay() {
  const date = new Date();
  const options = {
    weekday: 'long',
    timeZone: 'America/Sao_Paulo'
  };
  let dayName = date.toLocaleDateString('pt-BR', options);
  dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  document.getElementById("day").textContent = `| ${dayName}`;
}

function updateFavoritePlacesTime() {
  const time = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const dateOptions = {
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Sao_Paulo'
  };
  const formattedDate = time.toLocaleDateString('pt-BR', dateOptions);

  document.querySelectorAll('.hours').forEach(element => {
    element.textContent = time.toLocaleTimeString('pt-BR', options);
  });

  const dateElement = document.querySelector('.titulo-favorite span');
  if (dateElement) {
    dateElement.textContent = formattedDate;
  }
}

function updateForecastDays() {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const hoje = new Date();

  const elementosDias = document.querySelectorAll('.text-0');

  elementosDias.forEach((elemento, index) => {
    const data = new Date();
    data.setDate(hoje.getDate() + index);
    const diaSemana = diasSemana[data.getDay()];

    if (index === 0) {
      elemento.textContent = 'Hoje';
    } else if (index === 1) {
      elemento.textContent = 'Amanhã';
    } else {
      elemento.textContent = diaSemana;
    }

    const diaMes = data.getDate();
    const mes = data.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
    elemento.closest('.day_col').querySelector('.subtitle-m').textContent = `${diaMes} ${mes}.`;
  });
}

function helpfulMessage(temp) {
  const mensagem = document.getElementById('message');
  mensagem.className = 'weather-message';

  if (temp > 30) {
    mensagem.classList.add('hot');
    mensagem.innerHTML = `🔥 <strong>Calor Extremo!</strong><span>Melhor ficar na sombra com uma gelada.</span> <small>Dica: Evite sair entre 10h-16h e use MUITO protetor solar</small>`;
  } else if (temp > 25) {
    mensagem.classList.add('warm');
    mensagem.innerHTML = `☀️ <strong>Dia Quente</strong> <span>Perfeito para praia ou piscina!</span> <small>Dica: Chapéu e óculos escuros são ótimos aliados</small>`;
  } else if (temp > 20) {
    mensagem.classList.add('mild');
    mensagem.innerHTML = `🌤️ <strong>Clima Perfeito</strong> <span>Temperatura ideal para qualquer atividade ao ar livre!</span> <small>Dica: Aproveite para fazer um piquenique no parque</small>`;
  } else if (temp > 15) {
    mensagem.classList.add('cool');
    mensagem.innerHTML = `🍃 <strong>Fresquinho</strong> <span>Ótimo para caminhar ou pedalar com um casaco leve.</span> <small>Dica: Leve um agasalho para quando o vento aumentar</small>`;
  } else if (temp > 0) {
    mensagem.classList.add('cold');
    mensagem.innerHTML = `❄️ <strong>Frio Chegando</strong> <span>Hora dos casacos quentes e bebidas aconchegantes!</span> <small>Dica: Chocolate quente ou chá vão te aquecer bem</small>`;
  } else {
    mensagem.classList.add('freezing');
    mensagem.innerHTML = `⛄  <strong>Frio Polar!</strong> <span>Cuidado com hipotermia! Melhor ficar embaixo das cobertas.</span> <small>Dica: Sopas quentes e aquecedores são seus melhores amigos</small>`;
  }
}

const elements = {
  cityName: document.querySelector('.forecast-main h1'),
  currentTemp: document.querySelector('.celsius'),
  feelsLike: document.querySelector('.txt-strng'),
  weatherIcon: document.getElementById('cloud'),
  weatherDesc: document.querySelector('.description'),
  dailyForecast: document.querySelectorAll('.grid-item')
};

const iconMap = {
    '01d': 'cloud.png',
    '01n': 'cloud.png',
    '02d': 'cloud.png',
    '03d': 'cloud.png',
    '04d': 'cloudy.png',
    '09d': 'cloud.png',
    '10d': 'cloud.png',
    '11d': 'cloud.png',
    '13d': 'cloud.png',
    '50d': 'cloud.png'
};

async function updateCurrentWeather() {
  try {
    const data = await getCurrentWeather();

    elements.cityName.textContent = `Previsão do Tempo ${data.name}`;
    elements.currentTemp.textContent = `${Math.round(data.main.temp)}°`;
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    elements.weatherDesc.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    elements.weatherIcon.src = `./img/${iconMap[iconCode] || 'cloud.png'}`;

    helpfulMessage(Math.round(data.main.temp));

  } catch (error) {
    console.error("Erro ao buscar clima atual:", error);
    elements.weatherDesc.textContent = "Erro ao carregar dados meteorológicos";
  }
}

async function updateFiveDayForecast() {
    try {
        const { list } = await getFiveDayForecast();

        const dailyForecasts = {};
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateDay = new Date(date);
            dateDay.setHours(0, 0, 0, 0);

            if (dateDay.getTime() === hoje.getTime()) return;

            const dateStr = dateDay.toISOString().split('T')[0];

            if (!dailyForecasts[dateStr]) {
                dailyForecasts[dateStr] = {
                    temps: [],
                    tempsMax: [],
                    tempsMin: [],
                    pops: [],
                    icons: []
                };
            }

            dailyForecasts[dateStr].temps.push(item.main.temp);
            dailyForecasts[dateStr].tempsMax.push(item.main.temp_max);
            dailyForecasts[dateStr].tempsMin.push(item.main.temp_min);
            dailyForecasts[dateStr].icons.push(item.weather[0].icon);
            if (item.pop) dailyForecasts[dateStr].pops.push(item.pop);
        });

        const forecastDates = Object.keys(dailyForecasts).sort().slice(0, 5);

        forecastDates.forEach((dateStr, index) => {
            const dayElement = elements.dailyForecast[index];
            if (!dayElement) return;

            const date = new Date(dateStr);
            const dayOfWeek = diasSemana[date.getDay()];
            const dayMonth = date.getDate();
            const month = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();

            const forecast = dailyForecasts[dateStr];
            const avgTemp = Math.round(forecast.temps.reduce((a, b) => a + b, 0) / forecast.temps.length);
            const maxTemp = Math.round(Math.max(...forecast.tempsMax));
            const minTemp = Math.round(Math.min(...forecast.tempsMin));

            dayElement.querySelector('.text-0').textContent = 
                index === 0 ? 'Hoje' : dayOfWeek;

            dayElement.querySelector('.subtitle-m').textContent = `${dayMonth} ${month}.`;

            const tempCenter = dayElement.querySelector('.Temperatura-5days');
            if (tempCenter) tempCenter.textContent = `${Math.round(avgTemp)}°`;

            const maxSpan = dayElement.querySelector('.max');
            const minSpan = dayElement.querySelector('.min');
            if (maxSpan) maxSpan.textContent = `${maxTemp}°`;
            if (minSpan) minSpan.textContent = `${minTemp}°`;
        });

    } catch (error) {
        console.error("Erro ao buscar previsão:", error);
    }
}

async function updatePrecipitationToday() {
    try {
        const { list } = await getFiveDayForecast();

        const now = new Date();
        const next24h = list.filter(item => {
            const itemDate = new Date(item.dt * 1000);
            return itemDate > now && itemDate - now <= 24 * 60 * 60 * 1000;
        });

        const pops = next24h.map(item => item.pop || 0);

        if (pops.length > 0) {
            const maxPop = Math.round(Math.max(...pops) * 100);
            const precipitationElement = document.getElementById('precipitação');
            if (precipitationElement) {
                precipitationElement.textContent = `${maxPop}%`;
            }
        } else {
            const precipitationElement = document.getElementById('precipitação');
            if (precipitationElement) {
                precipitationElement.textContent = `0%`;
            }
        }

    } catch (error) {
        console.error("Erro ao buscar precipitação:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  updateDay();
  updateTime();
  setInterval(updateTime, 1000);
  setInterval(updateFavoritePlacesTime, 1000);
  updateCurrentWeather();
  updateFiveDayForecast();
  updateForecastDays();
  updatePrecipitationToday();
});



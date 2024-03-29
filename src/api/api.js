const API_HOST = process.env.API_HOST;

const { transformApiDataToStandart } = require('./helper/helper.js');

async function getWeatherByCityName(city) {
  const response = await fetch(
    `${API_HOST}?q=${city}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`,
    {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  const data = await response.json();
  const obj = transformApiDataToStandart(data);

  return obj;
}

async function getWeatherByLocation(location) {
  const response = await fetch(
    `${API_HOST}?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`,
    {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  const data = await response.json();
  const obj = transformApiDataToStandart(data);

  return obj;
}

module.exports = { getWeatherByCityName, getWeatherByLocation };

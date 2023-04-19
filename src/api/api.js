const API_HOST = process.env.API_HOST;

const { recordDataToObject } = require('./../helper.js');

async function getDataFromServer(city) {
  const api =
    API_HOST + `?q=${city}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`;
  const response = await fetch(api, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  const obj = recordDataToObject(data);
  // const data = await response.json();
  // const obj = {
  //   city: data.name,
  //   temp: data.main.temp,
  //   status: data.weather[0].description,
  //   speedwind: data.wind.speed,
  // };

  return obj;
}

async function getTrackFromServer(location) {
  const api =
    API_HOST +
    `?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`;
  const response = await fetch(api, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  const obj = recordDataToObject(data);

  return obj;
}

module.exports = { getDataFromServer, getTrackFromServer };

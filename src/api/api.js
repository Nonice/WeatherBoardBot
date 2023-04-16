const link = process.env.LINK;

async function getDataFromServer(city) {
  const api =
    link + `?q=${city}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`;
  const response = await fetch(api, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  const obj = {
    city: data.name,
    temp: data.main.temp,
    status: data.weather[0].description,
    speedwind: data.wind.speed,
  };

  return obj;
}

async function getTrackFromServer(location) {
  const api =
    link +
    `?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`;
  const response = await fetch(api, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();

  const obj = {
    city: data.name,
    temp: data.main.temp,
    status: data.weather[0].description,
    speedwind: data.wind.speed,
  };

  return obj;
}

module.exports = { getDataFromServer, getTrackFromServer };

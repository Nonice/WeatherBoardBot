const { getWeatherByCityName, getWeatherByLocation } = require('./api/api');

function transformStandartDataForOutputToUser(weatherData) {
  return (
    `📍Погода за вашими координатами \n` +
    `🌡️ Температура: ${weatherData.temp}°C \n` +
    `🌀 Швидкість вітру: ${weatherData.speedwind}м/c \n` +
    `🪟 За вікном зараз ${weatherData.status} `
  );
}

const getCityNameSession = async (ctx) => {
  // TODO:  Move to func 1
  ctx.reply('Будь ласка, напишіть назву міста');
  ctx.session.cityName = true;
};

const requestWeatherFromUserLocation = async (ctx) => {
  const location = ctx.message.location;
  const data = await getWeatherByLocation(location);
  ctx.reply(transformStandartDataForOutputToUser(data));
};

const requestWeatherFromUserCity = async (ctx) => {
  console.log(ctx.message.text);
  const cityPerChat = ctx.message.text;
  const data = await getWeatherByCityName(cityPerChat);
  ctx.session.cityName = false;
  ctx.reply(transformStandartDataForOutputToUser(data));
};

module.exports = {
  transformStandartDataForOutputToUser,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
};

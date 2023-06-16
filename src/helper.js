const { getWeatherByCityName, getWeatherByLocation } = require('./api/api');
const { cityErrorMessage } = require('./messages/cityErrorMessage');

function transformStandartDataForOutputToUser(weatherData) {
  return (
    `📍Погода за вашими координатами \n` +
    `🌆 Місто: ${weatherData.city}\n` +
    `🌡️ Температура: ${weatherData.temp}°C \n` +
    `🌀 Швидкість вітру: ${weatherData.speedwind}м/c \n` +
    `🪟 За вікном зараз ${weatherData.status} `
  );
}

// TODO: RENAME and move to `something...`
const getCityNameSession = async (ctx) => {
  ctx.reply('Будь ласка, напишіть назву міста');

  ctx.session.inputState = 'cityname';

  ctx.answerCbQuery();
};

const requestWeatherFromUserLocation = async (ctx) => {
  const location = ctx.message.location;

  const data = await getWeatherByLocation(location);

  ctx.reply(transformStandartDataForOutputToUser(data));
};

const requestWeatherFromUserCity = async ({ text, session }) => {
  if (session) session.inputState = null;

  const data = await getWeatherByCityName(text);

  if (data.cod !== 200) {
    return cityErrorMessage(data.message);
  }

  return transformStandartDataForOutputToUser(data);
};

module.exports = {
  transformStandartDataForOutputToUser,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
};

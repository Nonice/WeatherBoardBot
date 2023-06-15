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

  ctx.session.cityName = true;
};

const requestWeatherFromUserLocation = async (ctx) => {
  const location = ctx.message.location;

  const data = await getWeatherByLocation(location);

  ctx.reply(transformStandartDataForOutputToUser(data));
};

const requestWeatherFromUserCity = async ({ messageText, session }) => {
  if (session) session.cityName = false;

  const data = await getWeatherByCityName(messageText);

  if (data.cod !== 200) {
    return cityErrorMessage(data.message);
  }

  return transformStandartDataForOutputToUser(data);
};

const checkedNotificatedTimeNorms = async ({ text, session }) => {
  const date = new Date(`01/01/1970 ${text}`);

  if (isNaN(date.getTime())) {
    return 'Not valid time format. Try again';
  }

  session.timeNotified =
    (date.getTime() - date.getTimezoneOffset() * 60 * 1000) / 1000;

  session.notificationCheck = 'city';

  return 'Input city name:';
};

const checkedNotificatedCity = async ({ text, session }) => {
  const data = await getWeatherByCityName(text);

  if (data.cod !== 200) {
    return 'Not valid city name! Try again';
  }

  session.timeNotifiedCity = text;
  session.notificationCheck = null;

  const timeString = new Date(session.timeNotified * 1000).toLocaleTimeString(
    'en-GB',
    { timeZone: 'UTC' }
  );

  return `Setted time = ${timeString}, city name = ${text}`;
};

module.exports = {
  checkedNotificatedTimeNorms,
  checkedNotificatedCity,
  transformStandartDataForOutputToUser,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
};

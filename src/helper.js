const { getWeatherByCityName, getWeatherByLocation } = require('./api/api');
const { cityErrorMessage } = require('./messages/cityErrorMessage');

function transformStandartDataForOutputToUser(weatherData) {
  return (
    `📍Погода за вашими координатами \n` +
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

const requestWeatherFromUserCity = async (ctx) => {
  console.log(ctx.message.text);
  const cityPerChat = ctx.message.text;
  const data = await getWeatherByCityName(cityPerChat);

  ctx.session.cityName = false;

  if (data.cod !== 200) {
    ctx.reply(cityErrorMessage(data.message));
    return;
  }

  ctx.reply(transformStandartDataForOutputToUser(data));
};

const functionNotificated = async (ctx) => {
  const test = ctx.message.text;
  ctx.session.timeNotified = test;
  console.log(ctx.session.timeNotified);
};

function timeConverter(timeNotified) {
  hours = Number(timeNotified[0] + timeNotified[1]);
  minutes = Number(timeNotified[3] + timeNotified[4]);
  const time = hours * 60 * 60 + minutes * 60;
  console.log(timeNotified);
  console.log(time);
  return time;
}
// wtf is
const checkedNotificatedTimeNorms = async (ctx) => {
  let cheked = new Boolean(true);

  if (ctx.message.text.length == 5) {
    for (let i = 0; i < ctx.message.text.length; i++) {
      // ctx.reply(ctx.message.text[i] + 'and ' + i);
      if (isFinite(ctx.message.text[i])) {
      } else if (ctx.message.text[i] == `:` && i == 2) {
        // ctx.reply('it`s double dote');
      } else {
        ctx.reply('succses but not norm');
        cheked = false;
        ctx.session.notificationCheck = true;
        break;
      }
    }
  } else {
    ctx.reply('succses but leng not 5');
    cheked = false;
    ctx.session.notificationCheck = true;
  }

  if (cheked) {
    ctx.session.timeNotified = timeConverter(ctx.message.text);
    // ctx.reply('write City');
    await addCityToNotification(ctx);
    // Ask a Question for ivan
    // ctx.session.notificationCheck = false;
  }
};
// wtf is
const addCityToNotification = async (ctx) => {
  ctx.reply('write City');
  ctx.session.city = ctx.message.text;
  ctx.session.notificationCheck = false;
};

async function notification(city) {
  let weatherData = await getWeatherByCityName(city);
  let message = transformStandartDataForOutputToUser(weatherData);
  return message;
}

module.exports = {
  notification,
  checkedNotificatedTimeNorms,
  functionNotificated,
  timeConverter,
  transformStandartDataForOutputToUser,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
};

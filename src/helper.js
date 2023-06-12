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

function mdfckj(sessionData) {
  let timeNow =
    new Date().getUTCHours() * 60 * 60 + new Date().getUTCMinutes() * 60;
  let test = 0;
  sessionData.forEach(({ data: { timeNotified } }) => {
    console.log((test += 1));
    let userTime = timeConverter(timeNotified);
    if (timeNow == userTime) {
      console.log('success');
    }
    console.log('success but not is timer');
    console.log(timeNotified);
  });
  // return mdfckj(sessionData);
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
  // console.log(timeNotified);
  // console.log(
  //   new Date().getUTCHours() * 60 * 60 + new Date().getUTCMinutes() * 60
  // );
  // console.log(time);
  return time;
}

const checkedNotificatedTimeNorms = async (ctx) => {
  if (ctx.message.text.length == 5) {
    ctx.reply('succses');
    let 
    for (let i = 0; i < ctx.message.text.length; i++) {
      // ctx.reply(ctx.message.text[i]);
      if (isFinite(ctx.message.text[i])) {
      } else if (ctx.message.text[i] == `:`) {
        ctx.reply('it`s double dote');
      } else {
        ctx.reply('not number');
        break;
      }
    }
  } else {
    ctx.reply('succses but leng not 5');
    ctx.session.notificationCheck = true;
  }
};

module.exports = {
  mdfckj,
  checkedNotificatedTimeNorms,
  functionNotificated,
  timeConverter,
  transformStandartDataForOutputToUser,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
};

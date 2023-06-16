const { getWeatherByCityName } = require('../api/api');
const { INPUT_STATE_NOTIFICATIONS_CITY } = require('../config/inputState');

async function checkedNotificatedTimeNorms({ text, session }) {
  const date = new Date(`01/01/1970 ${text}`);

  if (isNaN(date.getTime())) {
    return 'Недійсний формат часу.Спробуйте ще раз.';
  }

  session.timeNotified =
    (date.getTime() - date.getTimezoneOffset() * 60 * 1000) / 1000;

  session.inputState = INPUT_STATE_NOTIFICATIONS_CITY;

  return 'Input city name:';
}

async function checkedNotificatedCity({ text, session }) {
  const data = await getWeatherByCityName(text);

  if (data.cod !== 200) {
    return 'Недійсна назва міста! Спробуйте ще раз.';
  }

  session.timeNotifiedCity = text;
  session.inputState = null;

  const timeString = new Date(session.timeNotified * 1000).toLocaleTimeString(
    'en-GB',
    { timeZone: 'UTC' }
  );

  return `Встановлений час:${timeString}. \n Обране місто:${text}.`;
}

module.exports = {
  checkedNotificatedTimeNorms,
  checkedNotificatedCity,
};

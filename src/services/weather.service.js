const { getWeatherByCityName, getWeatherByLocation } = require('../api/api');
const { cityErrorMessage } = require('../messages/cityErrorMessage');
const { transformStandartDataForOutputToUser } = require('../helper');

const requestWeatherFromUserLocation = async (ctx) => {
  const location = ctx.message.location;

  const data = await getWeatherByLocation(location);

  ctx.reply(transformStandartDataForOutputToUser(data));
};

const requestWeatherFromUserCity = async ({ text, session }) => {
  if (text === undefined) return;
  if (session) session.inputState = null;

  const data = await getWeatherByCityName(text);

  if (data.cod !== 200) {
    return cityErrorMessage(data.message);
  }

  return transformStandartDataForOutputToUser(data);
};

module.exports = {
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
};

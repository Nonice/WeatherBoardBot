const { getWeatherByCityName, getWeatherByLocation } = require('../api/api');
const { cityErrorMessage } = require('../messages/cityErrorMessage');

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
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
};

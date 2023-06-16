const { Composer } = require('telegraf');

const WEATHER_GET_BY_LOCATION = 'WEATHER_GET_BY_LOCATION';
const WEATHER_GET_BY_NAME = 'WEATHER_GET_BY_NAME';

const SENG_LOCATION_MESSAGE = 'Будь ласка, надішліть свою геолокацію';
const SENG_CITY_NAME_MESSAGE = 'Будь ласка, напишіть назву міста';

const getCityNameSession = async (ctx) => {
  ctx.reply(SENG_CITY_NAME_MESSAGE);

  ctx.session.inputState = 'cityname';

  ctx.answerCbQuery();
};

function getWeatherMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Знайти за геолокацією',
            callback_data: WEATHER_GET_BY_LOCATION,
          },
        ],
        [{ text: 'Знайти за назвою', callback_data: WEATHER_GET_BY_NAME }],
        [{ text: ' « Back', callback_data: 'Back' }],
      ],
    },
  };
}

const weatherComposer = new Composer();

weatherComposer.action('Weather', (ctx) => {
  ctx.editMessageText('Оберіть, будь ласка, місто', getWeatherMenu());
  ctx.answerCbQuery();
});

weatherComposer.command('city_name', getCityNameSession);
weatherComposer.command('location', async (ctx) => {
  ctx.reply(SENG_LOCATION_MESSAGE);
});

weatherComposer.action(WEATHER_GET_BY_LOCATION, (ctx) => {
  ctx.reply(SENG_LOCATION_MESSAGE);
  ctx.answerCbQuery();
});

weatherComposer.action(WEATHER_GET_BY_NAME, getCityNameSession);

module.exports = {
  weatherComposer,
};

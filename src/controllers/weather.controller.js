const { Composer } = require('telegraf');
const { BACK_ACTION, WEATHER_MENU_ACTION } = require('../config/actions');
const { INPUT_STATE_CITY_NAME } = require('../config/inputState');

const WEATHER_GET_BY_LOCATION_ACTION = 'WEATHER_GET_BY_LOCATION';
const WEATHER_GET_BY_NAME_ACTION = 'WEATHER_GET_BY_NAME';

const SENG_LOCATION_MESSAGE = 'Будь ласка, надішліть свою геолокацію';
const SENG_CITY_NAME_MESSAGE = 'Будь ласка, напишіть назву міста';

const getCityNameSession = async (ctx) => {
  ctx.reply(SENG_CITY_NAME_MESSAGE);

  ctx.session.inputState = INPUT_STATE_CITY_NAME;

  ctx.answerCbQuery();
};

const getLocationSession = async (ctx) => {
  ctx.reply(SENG_LOCATION_MESSAGE);
  ctx.answerCbQuery();
};

function getWeatherMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Знайти за геолокацією',
            callback_data: WEATHER_GET_BY_LOCATION_ACTION,
          },
        ],
        [
          {
            text: 'Знайти за назвою',
            callback_data: WEATHER_GET_BY_NAME_ACTION,
          },
        ],
        [{ text: ' « Повернутися', callback_data: BACK_ACTION }],
      ],
    },
  };
}

const weatherComposer = new Composer();

weatherComposer.action(WEATHER_MENU_ACTION, (ctx) => {
  ctx.editMessageText('Оберіть спосіб', getWeatherMenu());
  ctx.answerCbQuery();
});

weatherComposer.command('city_name', getCityNameSession);
weatherComposer.command('location', getLocationSession);

weatherComposer.action(WEATHER_GET_BY_NAME_ACTION, getCityNameSession);
weatherComposer.action(WEATHER_GET_BY_LOCATION_ACTION, getLocationSession);

module.exports = {
  weatherComposer,
};

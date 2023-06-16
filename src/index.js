require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');

const {
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
} = require('./services/weather.service');

const {
  checkedNotificatedTimeNorms,
  checkedNotificatedCity,
} = require('./services/notifications.service');

const { initializeBotCommands } = require('./initialize.js');

const { getReplyMarkup } = require('./services/getReplyMarkup.service.js');
const {
  notificationComposer,
} = require('./controllers/notifications.controller.js');
const { weatherComposer } = require('./controllers/weather.controller');
const {
  BACK_TO_SETTINGS_ACTION,
  BACK_ACTION,
  SETTINGS_MENU_ACTION,
} = require('./config/actions');
const {
  INPUT_STATE_CITY_NAME,
  INPUT_STATE_NOTIFICATIONS_TIME,
  INPUT_STATE_NOTIFICATIONS_CITY,
} = require('./config/inputState');

const bot = new Telegraf(process.env.BOT_TOKEN);

const localSession = new LocalSession({
  database: 'session-store.json',
  property: 'session',
  storage: LocalSession.storageFileAsync,
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2),
    deserialize: (str) => JSON.parse(str),
  },
  state: {},
});

bot.use(localSession);

bot.use(notificationComposer);
bot.use(weatherComposer);

const sendMenu = (ctx) => {
  ctx.replyWithHTML('Menu', getReplyMarkup('main'));
};

bot.start(sendMenu);
bot.command('menu', sendMenu);

bot.action(SETTINGS_MENU_ACTION, (ctx) => {
  ctx.editMessageText('Settings', getReplyMarkup('settings'));

  ctx.answerCbQuery();
});

bot.action(BACK_TO_SETTINGS_ACTION, async (ctx) => {
  ctx.editMessageText('Menu', getReplyMarkup('settings'));

  ctx.answerCbQuery();
});

bot.action(BACK_ACTION, async (ctx) => {
  ctx.editMessageText('Menu', getReplyMarkup('main'));

  ctx.answerCbQuery();
});

bot.on(message('location'), requestWeatherFromUserLocation);

bot.on(message('text'), async (ctx) => {
  const functionsInput = {
    text: ctx.message.text,
    session: ctx.session,
  };

  switch (ctx.session.inputState) {
    case INPUT_STATE_CITY_NAME: {
      ctx.reply(await requestWeatherFromUserCity(functionsInput));
      break;
    }

    case INPUT_STATE_NOTIFICATIONS_TIME: {
      ctx.reply(await checkedNotificatedTimeNorms(functionsInput));
      break;
    }

    case INPUT_STATE_NOTIFICATIONS_CITY: {
      ctx.reply(await checkedNotificatedCity(functionsInput));
      break;
    }
  }
});

initializeBotCommands(bot.telegram);
bot.launch();

localSession.DB.then((DB) => {
  setInterval(() => {
    console.log(DB.get('sessions').value());
    const sessionData = DB.get('sessions').value();
    const date = new Date();

    let timeNow = date.getUTCHours() * 60 * 60 + date.getUTCMinutes() * 60;

    console.log(`[CYCLE] Runned in ${timeNow}`);

    sessionData.forEach(
      async ({ data: { timeNotified, userID, timeNotifiedCity } }) => {
        console.log(
          `[CYCLE] userID = ${userID}, timeNotified = ${timeNotified}, timeNotifiedCity = ${timeNotifiedCity}`
        );

        if (
          timeNotified == timeNow &&
          timeNotifiedCity !== undefined &&
          userID !== undefined
        ) {
          const cityWeather = await requestWeatherFromUserCity({
            text: timeNotifiedCity,
          });

          bot.telegram.sendMessage(
            userID,
            `Notification by ${date.getUTCHours()}:${date.getUTCMinutes()} UTC.
					\n${cityWeather}`
          );
        }
      }
    );
  }, 60000);
});

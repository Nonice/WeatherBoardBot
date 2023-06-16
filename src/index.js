require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');

const {
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
} = require('./helper.js');

const { initializeBotCommands } = require('./initialize.js');

const { getReplyMarkup } = require('./services/getReplyMarkup.service.js');
const {
  notificationComposer,
  checkedNotificatedTimeNorms,
  checkedNotificatedCity,
} = require('./controllers/notifications.controller.js');

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

const sendMenu = (ctx) => {
  ctx.replyWithHTML('Menu', getReplyMarkup('main'));
};

bot.start(sendMenu);
bot.command('menu', sendMenu);

bot.command('location', async (ctx) => {
  // TODO: Move to func 2
  ctx.reply('Будь ласка, надішліть свою геолокацію');
});

bot.command('city_name', getCityNameSession);

bot.action('Weather', (ctx) => {
  ctx.editMessageText('Оберіть, будь ласка, місто', getReplyMarkup('findBy'));

  ctx.answerCbQuery();
});

bot.action('Settings', (ctx) => {
  ctx.editMessageText('Settings', getReplyMarkup('settings'));

  ctx.answerCbQuery();
});

bot.action('BackToMenu', async (ctx) => {
  ctx.editMessageText('Menu', getReplyMarkup('settings'));

  ctx.answerCbQuery();
});

bot.action('Back', async (ctx) => {
  ctx.editMessageText('Menu', getReplyMarkup('main'));

  ctx.answerCbQuery();
});

bot.action('GetData', getCityNameSession);

bot.action('GetTrack', (ctx) => {
  // TODO: Move to func 2
  ctx.reply('Будь ласка, надішліть свою геолокацію');

  ctx.answerCbQuery();
});

bot.on(message('location'), requestWeatherFromUserLocation);

bot.on(message('text'), async (ctx) => {
  const functionsInput = {
    text: ctx.message.text,
    session: ctx.session,
  };

  switch (ctx.session.inputState) {
    case 'cityname': {
      ctx.reply(await requestWeatherFromUserCity(functionsInput));
      break;
    }

    case 'notification-time': {
      ctx.reply(await checkedNotificatedTimeNorms(functionsInput));
      break;
    }

    case 'notification-city': {
      ctx.reply(await checkedNotificatedCity(functionsInput));
      break;
    }
  }
});

initializeBotCommands(bot.telegram);
bot.launch();

localSession.DB.then((DB) => {
  setTimeout(() => {
    console.log(DB.get('sessions').value());
    const sessionData = DB.get('sessions').value();
    const date = new Date();

    let timeNow = date.getUTCHours() * 60 * 60 + date.getUTCMinutes() * 60;

    sessionData.forEach(
      async ({ data: { timeNotified, userID, timeNotifiedCity } }) => {
        console.log(timeNotified, timeNow, timeNotifiedCity);
        if (timeNotified == timeNow) {
          const cityWeather = await requestWeatherFromUserCity({
            messageText: timeNotifiedCity,
          });

          bot.telegram.sendMessage(
            userID,
            `Notification by ${date.getUTCHours()}:${date.getUTCMinutes()} UTC.
					\n${cityWeather}`
          );
        }
      }
    );
  }, 1000);
});

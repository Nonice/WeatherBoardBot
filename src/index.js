require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');

const bot = new Telegraf(process.env.BOT_TOKEN);

const {
  checkedNotificatedTimeNorms,
  timeConverter,
  transformStandartDataForOutputToUser,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
} = require('./helper.js');
const { isCityName } = require('./middlewares/isCityName.middleware');
const { isNotification } = require('./middlewares/isNotification.middleware');

const localSession = new LocalSession({
  database: 'example_db.json',
  property: 'session',
  storage: LocalSession.storageFileAsync,
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2),
    deserialize: (str) => JSON.parse(str),
  },
  state: { messages: [] },
});

// TODO: Moved `example_db.json` to config
bot.use(localSession);

// telegram id
bot.action('Notification', (ctx) => {
  ctx.session.notificationCheck = true;
  ctx.session.userID = ctx.from.id;

  ctx.reply('Write time PLS {example 20:00}:');
});

bot.start((ctx) => {
  ctx.replyWithHTML('⠀⠀⠀⠀⠀⠀Menu', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Weather', callback_data: 'Weather' }],
        [{ text: 'Settings', callback_data: 'Settings' }],
      ],
    },
  });
});

bot.telegram.setMyCommands([
  {
    command: 'menu',
    description: 'menu',
  },
  {
    command: 'location',
    description: 'menu',
  },
  {
    command: 'city_name',
    description: 'menu',
  },
]);

bot.command('menu', (ctx) => {
  ctx.replyWithHTML('⠀⠀⠀⠀⠀Menu', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Weather', callback_data: 'Weather' }],
        [{ text: 'Settings', callback_data: 'Settings' }],
      ],
    },
  });
});

bot.command('location', async (ctx) => {
  // TODO: Move to func 2
  ctx.reply('Будь ласка, надішліть свою геолокацію');
});

bot.command('city_name', getCityNameSession);

bot.action('Weather', (ctx) => {
  ctx.editMessageText(' Оберіть, будь ласка, місто ', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Знайти за геолокацією', callback_data: 'GetTrack' }],
        [{ text: 'Знайти за назвою', callback_data: 'GetData' }],
        [{ text: ' « Back', callback_data: 'Back' }],
      ],
    },
  });
});

bot.action('Settings', (ctx) => {
  ctx.editMessageText(' Settings ', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Notification', callback_data: 'Notification' }],
        [{ text: ' « Back', callback_data: 'Back' }],
      ],
    },
  });
});

bot.action('Back', async (ctx) => {
  ctx.editMessageText(' Menu ', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Weather', callback_data: 'Weather' }],
        [{ text: 'Settings', callback_data: 'Settings' }],
      ],
    },
  });
});

bot.action('GetData', getCityNameSession);

bot.action('GetTrack', (ctx) => {
  // TODO: Move to func 2
  ctx.reply('Будь ласка, надішліть свою геолокацію');
});

bot.on(message('location'), requestWeatherFromUserLocation);

// bot.on(message('text'), isCityName, requestWeatherFromUserCity);

bot.on(message('text'), (ctx) => {
  if (isCityName(ctx)) {
    requestWeatherFromUserCity(ctx);
    return;
  }
  if (isNotification(ctx)) {
    // return ctx.reply(`SECOND WORKING: ${ctx.message.text}`);
    // console.log(typeof ctx.message.text);
    checkedNotificatedTimeNorms(ctx);
    return;
  }
  // console.log(isFinite(ctx.message.text));
  // console.log(Number.isFinite(ctx.message.text));
});

bot.launch();

localSession.DB.then((DB) => {
  setTimeout(function innerTimeout() {
    const sessionData = DB.get('sessions').value();
    console.log(
      '🚀 ~ file: index.js:155 ~ setInterval ~ sessionData:',
      sessionData
    );

    let timeNow =
      new Date().getUTCHours() * 60 * 60 + new Date().getUTCMinutes() * 60;

    sessionData.forEach(({ data: { userID, timeNotified } }) => {
      if (!userID || !timeNotified) return;

      console.log(timeNow, timeNotified);
      if (timeNow == timeNotified) {
        bot.telegram.sendMessage(
          userID,
          `TIME WEATHER, ${userID} on time ${timeNotified}`
        );
      }
    });

    setTimeout(innerTimeout, 60000);
  }, 60000);
});

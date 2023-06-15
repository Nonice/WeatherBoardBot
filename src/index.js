require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');

const bot = new Telegraf(process.env.BOT_TOKEN);

const {
  addCityToNotification,
  notification,
  functionNotificated,
  checkedNotificatedTimeNorms,
  timeConverter,
  transformStandartDataForOutputToUser,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
} = require('./helper.js');
const { isCityName } = require('./middlewares/isCityName.middleware');
const { isNotification } = require('./middlewares/isNotification.middleware');

// TODO: Moved `example_db.json` to config
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

bot.use(localSession);

// bot.use(new LocalSession({ database: 'example_db.json' }).middleware());

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
        [{ text: 'Notification', callback_data: 'NotiMenu' }],
        [{ text: ' « Back', callback_data: 'Back' }],
      ],
    },
  });
});

bot.action('NotiMenu', (ctx) => {
  ctx.editMessageText(' Notification ', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Add Notification', callback_data: 'addNotification' }],
        [{ text: 'Delete Notification', callback_data: 'deletNotification' }],
        [{ text: ' « Back', callback_data: 'BackToMenu' }],
      ],
    },
  });
});

// telegram id
bot.action('addNotification', (ctx) => {
  ctx.session.notificationCheck = true;
  ctx.session.userID = ctx.from.id;
  ctx.reply('write time pls {exsemple 20:00}');
  // timeConverter(ctx.session.timeNotified);
});

// telegram id
bot.action('deletNotification', (ctx) => {
  ctx.session.notificationCheck = false;
  ctx.session.timeNotified = null;
  ctx.reply('notions deleted');
  // timeConverter(ctx.session.timeNotified);
});

bot.action('BackToMenu', async (ctx) => {
  ctx.editMessageText(' Menu ', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Notification', callback_data: 'NotiMenu' }],
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

// isNotification;
// bot.on(message('text'), isNotification, functionNotificated);

bot.on(message('text'), (ctx) => {
  if (isCityName(ctx)) {
    requestWeatherFromUserCity(ctx);
  }
  if (isNotification(ctx)) {
    // return ctx.reply(`SECOND WORKING: ${ctx.message.text}`);
    // console.log(typeof ctx.message.text);
    checkedNotificatedTimeNorms(ctx);
  }
  // console.log(isFinite(ctx.message.text));
  // console.log(Number.isFinite(ctx.message.text));
});

bot.launch();

const { getWeatherByCityName, getWeatherByLocation } = require('./api/api');

localSession.DB.then((DB) => {
  // setTimeout(mdfckj, 10000, DB.get('sessions').value());
  // console.log(DB.get('sessions').value());

  setInterval(function mdfckj() {
    const sessionData = DB.get('sessions').value();
    let timeNow =
      new Date().getUTCHours() * 60 * 60 + new Date().getUTCMinutes() * 60;
    // console.log(timeNow);
    sessionData.forEach(async ({ data: { timeNotified, userID, city } }) => {
      if (timeNotified == timeNow) {
        bot.telegram.sendMessage(userID, `${await notification(city)}`);
      }
    });
  }, 60000);
});

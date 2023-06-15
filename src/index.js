require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');

const bot = new Telegraf(process.env.BOT_TOKEN);

const {
  checkedNotificatedTimeNorms,
  checkedNotificatedCity,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
} = require('./helper.js');

// TODO: Moved `example_db.json` to config
const localSession = new LocalSession({
  database: 'example_db.json',
  property: 'session',
  storage: LocalSession.storageFileAsync,
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2),
    deserialize: (str) => JSON.parse(str),
  },
  state: {},
});

bot.use(localSession);

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
        [{ text: 'Delete Notification', callback_data: 'deleteNotification' }],
        [{ text: ' « Back', callback_data: 'BackToMenu' }],
      ],
    },
  });
});

// telegram id
bot.action('addNotification', (ctx) => {
  ctx.session.notificationCheck = 'time';
  ctx.session.userID = ctx.from.id;
  ctx.reply('Enter time on notification(example 20:00): ');
});

// telegram id
bot.action('deleteNotification', (ctx) => {
  ctx.session.notificationCheck = false;
  ctx.session.timeNotified = null;
  ctx.session.timeNotifiedCity = null;
  ctx.reply('Notification has been deleted');
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

bot.on(message('text'), async (ctx) => {
  if (ctx.session.cityName) {
    ctx.reply(
      await requestWeatherFromUserCity({
        messageText: ctx.message.text,
        session: ctx.session,
      })
    );
    return;
  }

  if (ctx.session.notificationCheck === 'time') {
    ctx.reply(
      await checkedNotificatedTimeNorms({
        text: ctx.message.text,
        session: ctx.session,
      })
    );
    return;
  }

  if (ctx.session.notificationCheck === 'city') {
    ctx.reply(
      await checkedNotificatedCity({
        text: ctx.message.text,
        session: ctx.session,
      })
    );
    return;
  }
});

bot.launch();

localSession.DB.then((DB) => {
  setInterval(() => {
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
  }, 60000);
});

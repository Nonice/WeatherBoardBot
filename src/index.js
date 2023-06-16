require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');

const {
  checkedNotificatedTimeNorms,
  checkedNotificatedCity,
  getCityNameSession,
  requestWeatherFromUserLocation,
  requestWeatherFromUserCity,
} = require('./helper.js');

const { initializeBotCommands } = require('./initialize.js');

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

function getReplyMarkup(type = 'main') {
  if (type === 'main') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Weather', callback_data: 'Weather' }],
          [{ text: 'Settings', callback_data: 'Settings' }],
        ],
      },
    };
  }

  if (type === 'findBy') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Знайти за геолокацією', callback_data: 'GetTrack' }],
          [{ text: 'Знайти за назвою', callback_data: 'GetData' }],
          [{ text: ' « Back', callback_data: 'Back' }],
        ],
      },
    };
  }

  if (type === 'settings') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Notification', callback_data: 'NotiMenu' }],
          [{ text: ' « Back', callback_data: 'Back' }],
        ],
      },
    };
  }

  if (type === 'notificationMenu') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Add Notification', callback_data: 'addNotification' }],
          [
            {
              text: 'Delete Notification',
              callback_data: 'deleteNotification',
            },
          ],
          [{ text: ' « Back', callback_data: 'BackToMenu' }],
        ],
      },
    };
  }
}

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

bot.action('NotiMenu', (ctx) => {
  ctx.editMessageText('Notification', getReplyMarkup('notificationMenu'));

  ctx.answerCbQuery();
});

bot.action('addNotification', (ctx) => {
  if (ctx.chat.id < 0) {
    ctx.reply('Add notification not working in groups!');
    ctx.answerCbQuery();
    return;
  }

  ctx.session.inputState = 'notification-time';
  ctx.session.userID = ctx.from.id;
  ctx.reply('Enter time on notification(example 20:00): ');
  ctx.answerCbQuery();
});

bot.action('deleteNotification', (ctx) => {
  if (ctx.chat.id < 0) {
    ctx.reply('Delete notification not working in groups!');
    ctx.answerCbQuery();
    return;
  }

  ctx.session.inputState = null;
  ctx.session.timeNotified = null;
  ctx.session.timeNotifiedCity = null;

  ctx.reply('Notification has been deleted');

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
  if (ctx.session.inputState === 'cityname') {
    ctx.reply(
      await requestWeatherFromUserCity({
        messageText: ctx.message.text,
        session: ctx.session,
      })
    );
    return;
  }

  if (ctx.session.inputState === 'notification-time') {
    ctx.reply(
      await checkedNotificatedTimeNorms({
        text: ctx.message.text,
        session: ctx.session,
      })
    );
    return;
  }

  if (ctx.session.inputState === 'notification-city') {
    ctx.reply(
      await checkedNotificatedCity({
        text: ctx.message.text,
        session: ctx.session,
      })
    );
    return;
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

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
  INPUT_STATE_TIMEZONE,
} = require('./config/inputState');

const { checkedTimezone } = require('./services/timezone.service');
const { timezoneComposer } = require('./controllers/timezone.controller');

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
bot.use(timezoneComposer);

bot.command('mystats', (ctx) => {
  const timezone = ctx.session.timezone || 0;

  const timeNotifiedLocalDate = new Date(ctx.session.timeNotified * 1000);

  let timeNotifiedLocal = '-';

  if (
    ctx.session.timeNotified !== null &&
    !isNaN(timeNotifiedLocalDate.getTime())
  ) {
    timeNotifiedLocal = timeNotifiedLocalDate.toLocaleTimeString('en-GB', {
      timeZone: 'UTC',
    });
  }

  const timeNotifiedUTCDate = new Date(
    ctx.session.timeNotified * 1000 - timezone * 60 * 60 * 1000
  );

  let timeNotifiedUTC = '-';

  if (
    ctx.session.timeNotified !== null &&
    !isNaN(timeNotifiedUTCDate.getTime())
  ) {
    timeNotifiedUTC = timeNotifiedUTCDate.toLocaleTimeString('en-GB', {
      timeZone: 'UTC',
    });
  }

  ctx.reply(
    `User stats:\n` +
      `Notification:\n` +
      `Notification time = ${timeNotifiedUTC} UTC\n` +
      `Notification time = ${timeNotifiedLocal} local\n` +
      `Notification city = ${ctx.session.timeNotifiedCity || '-'}\n` +
      `Timezone = ${timezone}\n`
  );
});

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

    case INPUT_STATE_TIMEZONE: {
      ctx.reply(await checkedTimezone(functionsInput));
      break;
    }
  }
});

initializeBotCommands(bot.telegram);
bot.launch();

localSession.DB.then((DB) => {
  setInterval(() => {
    const sessionData = DB.get('sessions').value();
    const date = new Date();

    const timeNow = date.getUTCHours() * 60 * 60 + date.getUTCMinutes() * 60;

    console.log(
      `[CYCLE] Runned in ${new Date(timeNow * 1000).toLocaleTimeString(
        'en-GB',
        { timeZone: 'UTC' }
      )} UTC`
    );

    sessionData.forEach(
      async ({
        data: { timeNotified, userID, timeNotifiedCity, timezone },
      }) => {
        const userTimezone = timezone || 0;

        const timeNowForCheck = timeNow + userTimezone * 60 * 60;

        console.log(
          `[CYCLE] userID = ${userID}, timeNotified = ${timeNotified}, timeNotifiedCity = ${timeNotifiedCity}, timeNowForCheck = ${timeNowForCheck}`
        );

        if (
          timeNotified == timeNowForCheck &&
          timeNotifiedCity !== undefined &&
          userID !== undefined
        ) {
          const cityWeather = await requestWeatherFromUserCity({
            text: timeNotifiedCity,
          });

          const timeString = `01/01/1970 ${
            date.getUTCHours() + userTimezone - date.getTimezoneOffset() / 60
          }:${date.getUTCMinutes()}`;

          const time = new Date(timeString).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          });

          const message = `Notification by ${time}\n${cityWeather}`;

          bot.telegram.sendMessage(userID, message);
        }
      }
    );
  }, 60000);
});

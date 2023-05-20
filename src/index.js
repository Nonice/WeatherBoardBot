require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');

const bot = new Telegraf(process.env.BOT_TOKEN);

const { getWeatherByCityName, getWeatherByLocation } = require('./api/api');
const { transformStandartDataForOutputToUser } = require('./output.js');
const { isCityName } = require('./middlewares/isCityName.middleware');

// TODO: Moved `example_db.json` to config
bot.use(new LocalSession({ database: 'example_db.json' }).middleware());

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

bot.command('city_name', async (ctx) => {
  // TODO:  Move to func 1
  ctx.reply('Будь ласка, напишіть назву міста');

  ctx.session.cityName = true;
});

bot.on(message('text'), isCityName, async (ctx) => {
  console.log(ctx.message.text);
  const cityPerChat = ctx.message.text;
  const data = await getWeatherByCityName(cityPerChat);
  ctx.session.cityName = false;

  ctx.reply(transformStandartDataForOutputToUser(data));
});

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

bot.action('GetData', async (ctx) => {
  // TODO:  Move to func 1
  ctx.reply('Будь ласка, напишіть назву міста');

  ctx.session.cityName = true;
});

bot.action('GetTrack', (ctx) => {
  // TODO: Move to func 2
  ctx.reply('Будь ласка, надішліть свою геолокацію');
});

bot.on(message('location'), async (ctx) => {
  const location = ctx.message.location;
  const data = await getWeatherByLocation(location);
  ctx.reply(transformStandartDataForOutputToUser(data));
});

bot.launch();

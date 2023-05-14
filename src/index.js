require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);

const { getWeatherByCityName, getWeatherByLocation } = require('./api/api');
const { transformStandartDataForOutputToUser } = require('./output.js');

bot.start((ctx) => {
  ctx.replyWithHTML('    Menu   ', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Weather', callback_data: 'Weather' }],
        [{ text: 'Settings', callback_data: 'Settings' }],
      ],
    },
  });
});

bot.action('Weather', (ctx) => {
  ctx.replyWithHTML('Оберіть, будь ласка, місто', {
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
  ctx.replyWithHTML('Settings', {
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
    // parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Weather', callback_data: 'Weather' }],
        [{ text: 'Settings', callback_data: 'Settings' }],
      ],
    },
  });
});

bot.action('GetData', async (ctx) => {
  ctx.reply('Будь ласка, напишіть назву міста');
  bot.on(message('text'), async (ctx) => {
    console.log(ctx.message.text);
    const cityPerChat = ctx.message.text;
    const data = await getWeatherByCityName(cityPerChat);
    ctx.reply(transformStandartDataForOutputToUser(data));
  });
});

bot.action('GetTrack', (ctx) => {
  ctx.reply('Будь ласка, надішліть свою геолокацію');
  bot.on(message('location'), async (ctx) => {
    const location = ctx.message.location;
    const data = await getWeatherByLocation(location);
    ctx.reply(transformStandartDataForOutputToUser(data));
  });
});

bot.on(message('location'), async (ctx) => {
  const location = ctx.message.location;
  const data = await getWeatherByLocation(location);
  ctx.reply(transformStandartDataForOutputToUser(data));
});

bot.launch();

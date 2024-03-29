require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);

const { getWeatherByCityName, getWeatherByLocation } = require('./api/api');
const { transformStandartDataForOutputToUser } = require('./output.js');

bot.start((ctx) => {
  ctx.replyWithHTML('Оберіть, будь ласка, місто', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Знайти за геолокацією', callback_data: 'GetTrack' }],
        [{ text: 'Знайти за назвою', callback_data: 'GetData' }],
      ],
    },
  });
});

bot.hears(/Привіт+/i, (ctx) => {
  ctx.reply('\u{1F44B}');
});

bot.action('GetData', (ctx) => {
  ctx.reply('Будь ласка, напишіть назву міста');
});

bot.action('GetTrack', (ctx) => {
  ctx.reply('Будь ласка, надішліть свою геолокацію');
});

bot.on(message('text'), async (ctx) => {
  console.log(ctx.message.text);
  const cityPerChat = ctx.message.text;
  const data = await getWeatherByCityName(cityPerChat);
  ctx.reply(transformStandartDataForOutputToUser(data));
});

bot.on(message('location'), async (ctx) => {
  const location = ctx.message.location;
  const data = await getWeatherByLocation(location);
  ctx.reply(transformStandartDataForOutputToUser(data));
});

bot.launch();

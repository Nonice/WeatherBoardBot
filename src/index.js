require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const { getDataFromServer, getTrackFromServer } = require('./api/api');

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

bot.hears(/^[a-zA-Z]+$/, async (ctx) => {
  console.log(ctx.match[0]);
  const cityPerChat = ctx.match[0];
  const data = await getDataFromServer(cityPerChat);

  ctx.reply(
    '📍Погода у вашому місті \n🌡️ Температура: ' +
      data.temp +
      '°C \n🌀 Швидкість вітру: ' +
      data.speedwind +
      'м/c \n🪟 За вікном зараз ' +
      data.status
  );
  //📍Місто: Запоріжжя 🌡️ Температура: ##.  🌀 Швидкість вітру: ##.  🪟 За вікном зараз.
});

bot.hears(/^[а-яА-Я]+$/, async (ctx) => {
  console.log(ctx.match[0]);
  const cityPerChat = ctx.match[0];
  const data = await getDataFromServer(cityPerChat);

  ctx.reply(
    '📍Погода у вашому місті \n🌡️ Температура: ' +
      data.temp +
      '°C \n🌀 Швидкість вітру: ' +
      data.speedwind +
      'м/c \n🪟 За вікном зараз ' +
      data.status
  );
  //📍Місто: Запоріжжя 🌡️ Температура: ##.  🌀 Швидкість вітру: ##.  🪟 За вікном зараз.
});

bot.on('message', async (ctx) => {
  console.log(ctx.message);
  if (ctx.message.location) {
    const location = ctx.message.location;
    const data = await getTrackFromServer(location);

    ctx.reply(
      '📍Погода за вашими координатами \n🌡️ Температура: ' +
        data.temp +
        '°C \n🌀 Швидкість вітру: ' +
        data.speedwind +
        'м/c \n🪟 За вікном зараз ' +
        data.status
    );
    //📍Місто: Запоріжжя 🌡️ Температура: ##.  🌀 Швидкість вітру: ##.  🪟 За вікном зараз.
  }
});

bot.launch();

require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

async function getDataFromServer(city) {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`;

  console.log(api);
  const response = await fetch(api, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  console.log(data);

  const obj = {
    city: data.name,
    temp: data.main.temp,
    status: data.weather[0].description,
    speedwind: data.wind.speed,
  };

  return obj;
}

bot.start((ctx) => {
  ctx.replyWithHTML('Оберіть, будь ласка, місто', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Знайти за геолокацією', callback_data: 'TrackData' }],
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

bot.action('TrackData', (ctx) => {
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
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`;
    const response = await fetch(api, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    console.log(data);

    const obj = {
      city: data.name,
      temp: data.main.temp,
      status: data.weather[0].description,
      speedwind: data.wind.speed,
    };

    ctx.reply(
      '📍Погода за вашими координатами \n🌡️ Температура: ' +
        obj.temp +
        '°C \n🌀 Швидкість вітру: ' +
        obj.speedwind +
        'м/c \n🪟 За вікном зараз ' +
        obj.status
    );
    //📍Місто: Запоріжжя 🌡️ Температура: ##.  🌀 Швидкість вітру: ##.  🪟 За вікном зараз.
  }
});

bot.launch();

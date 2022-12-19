require ('dotenv').config()

const { Telegraf, Markup } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)


  async function getDataFromServer(city) {
	let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`

	console.log(api)
	let response = await fetch(api, {
		method: 'get',
		headers: { 'Content-Type': 'application/json' },
	})

	let data = await response.json()

	console.log(data)

	let obj = { city: data.name, temp: data.main.temp, status: data.weather[0].description,  }

	return obj

}

bot.start(ctx => {
	ctx.replyWithHTML('Оберіть, будь ласка, місто', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Знайти за геолокацією', callback_data: 'TrackData' }],
				[{ text: 'Знайти за назвою', callback_data: 'GetData' }],
			],
		},
	})
})

bot.hears(/Привіт+/i, ctx => {
	ctx.reply('\u{1F44B}')
})


bot.action('GetData', ctx => {
	ctx.reply('введіть назву міста латинецею')
})

bot.action('TrackData', ctx => {
	ctx.reply('geo')
})




// bot.hears(/^[a-zA-Z]+$/, async ctx => {
// 	console.log(ctx.match[0])
// 	let cityPerChat = ctx.match[0]
// 	let data = await getDataFromServer(cityPerChat)

// 	ctx.reply('температура в місті ' + cityPerChat + ' ' + data.temp+'|'+ data.status  )
// })

bot.hears(/^[а-яА-Я]+$/, async ctx => {
	console.log(ctx.match[0])
	let cityPerChat = ctx.match[0]
	let data = await getDataFromServer(cityPerChat)

	ctx.reply('температура в місті ' + cityPerChat + ' ' + data.temp+'|'+ data.status )
})

bot.on('message', async (ctx) => {
	console.log(ctx.message);
	if (ctx.message.location) {
	  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.API_TOKEN}&units=metric&lang=ua`;
	  let response = await fetch(api, {
		method: 'get',
		headers: { 'Content-Type': 'application/json' },
	})
		let data = await response.json()
		
	console.log(data)

	let obj = { city: data.name, temp: data.main.temp, status: data.weather[0].description,  }
	
	 ctx.reply('температура в місті '  + ' ' + obj.temp+'|'+ obj.status )
	}
  });

bot.launch()

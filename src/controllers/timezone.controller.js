const { Composer } = require('telegraf');
const { INPUT_STATE_TIMEZONE } = require('../config/inputState');

const timezoneComposer = new Composer();

timezoneComposer.command('timezone', (ctx) => {
  ctx.session.inputState = INPUT_STATE_TIMEZONE;

  ctx.reply('Input timezone as number x(-11 <= x <= 14)');
});

module.exports = {
  timezoneComposer,
};

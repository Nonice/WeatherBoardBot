const { Composer } = require('telegraf');
const { INPUT_STATE_TIMEZONE } = require('../config/inputState');

const timezoneComposer = new Composer();

timezoneComposer.command('timezone', (ctx) => {
  ctx.session.inputState = INPUT_STATE_TIMEZONE;

  ctx.reply(
    'Введіть різницю вашого часового поясу відносно UTC. \n Як вказано на прикладі x(-11 <= x <= 14)'
  );
});

module.exports = {
  timezoneComposer,
};

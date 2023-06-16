const { Composer } = require('telegraf');

const { getReplyMarkup } = require('../services/getReplyMarkup.service');
const {
  BACK_TO_SETTINGS_ACTION,
  SETTINGS_NOTIFICATION_MENU_ACTION,
} = require('../config/actions');
const { INPUT_STATE_NOTIFICATIONS_TIME } = require('../config/inputState');

const ADD_NOTIFICATION_ACTION = 'ADD_NOTIFICATION';
const DELETE_NOTIFICATION_ACTION = 'DELETE_NOTIFICATION';

function getNotificationMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Додати сповіщення', callback_data: ADD_NOTIFICATION_ACTION }],
        [
          {
            text: 'Видалити сповіщення',
            callback_data: DELETE_NOTIFICATION_ACTION,
          },
        ],
        [{ text: ' « Повернутися', callback_data: BACK_TO_SETTINGS_ACTION }],
      ],
    },
  };
}

const notificationComposer = new Composer();

notificationComposer.action(ADD_NOTIFICATION_ACTION, (ctx) => {
  if (ctx.chat.id < 0) {
    ctx.reply('Додати повідомлення не працює в групах!');
    ctx.answerCbQuery();
    return;
  }

  ctx.session.inputState = INPUT_STATE_NOTIFICATIONS_TIME;
  ctx.session.userID = ctx.from.id;
  ctx.reply('Введіть час сповіщення. (наприклад 20:00): ');
  ctx.answerCbQuery();
});

notificationComposer.action(DELETE_NOTIFICATION_ACTION, (ctx) => {
  if (ctx.chat.id < 0) {
    ctx.reply('Видалення сповіщень не працює в групах!');
    ctx.answerCbQuery();
    return;
  }

  ctx.session.inputState = null;
  ctx.session.timeNotified = null;
  ctx.session.timeNotifiedCity = null;

  ctx.reply('Сповіщення видалено.');

  ctx.answerCbQuery();
});

notificationComposer.action(SETTINGS_NOTIFICATION_MENU_ACTION, (ctx) => {
  ctx.editMessageText('Сповіщення', getNotificationMenu());

  ctx.answerCbQuery();
});

module.exports = {
  notificationComposer,
};

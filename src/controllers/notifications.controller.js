const { Composer } = require('telegraf');

const { getReplyMarkup } = require('../services/getReplyMarkup.service');

const BACK_TO_SETTINGS = 'BackToMenu';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';

function getNotificationMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Add Notification', callback_data: ADD_NOTIFICATION }],
        [
          {
            text: 'Delete Notification',
            callback_data: DELETE_NOTIFICATION,
          },
        ],
        [{ text: ' « Back', callback_data: BACK_TO_SETTINGS }],
      ],
    },
  };
}

const notificationComposer = new Composer();

notificationComposer.action(ADD_NOTIFICATION, (ctx) => {
  if (ctx.chat.id < 0) {
    ctx.reply('Add notification not working in groups!');
    ctx.answerCbQuery();
    return;
  }

  ctx.session.inputState = 'notification-time';
  ctx.session.userID = ctx.from.id;
  ctx.reply('Enter time on notification(example 20:00): ');
  ctx.answerCbQuery();
});

notificationComposer.action(DELETE_NOTIFICATION, (ctx) => {
  if (ctx.chat.id < 0) {
    ctx.reply('Delete notification not working in groups!');
    ctx.answerCbQuery();
    return;
  }

  ctx.session.inputState = null;
  ctx.session.timeNotified = null;
  ctx.session.timeNotifiedCity = null;

  ctx.reply('Notification has been deleted');

  ctx.answerCbQuery();
});

notificationComposer.action(BACK_TO_SETTINGS, async (ctx) => {
  ctx.editMessageText('Menu', getReplyMarkup('settings'));

  ctx.answerCbQuery();
});

notificationComposer.action('NotificationMenu', (ctx) => {
  ctx.editMessageText('Notification', getNotificationMenu());

  ctx.answerCbQuery();
});

module.exports = {
  notificationComposer,
};

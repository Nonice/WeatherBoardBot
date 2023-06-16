const {
  BACK_ACTION,
  SETTINGS_NOTIFICATION_MENU_ACTION,
  WEATHER_MENU_ACTION,
  SETTINGS_MENU_ACTION,
} = require('../config/actions');

function getReplyMarkup(type = 'main') {
  if (type === 'main') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Weather', callback_data: WEATHER_MENU_ACTION }],
          [{ text: 'Settings', callback_data: SETTINGS_MENU_ACTION }],
        ],
      },
    };
  }

  if (type === 'settings') {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Notification',
              callback_data: SETTINGS_NOTIFICATION_MENU_ACTION,
            },
          ],
          [{ text: ' « Back', callback_data: BACK_ACTION }],
        ],
      },
    };
  }
}

module.exports = { getReplyMarkup };

function getReplyMarkup(type = 'main') {
  if (type === 'main') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Weather', callback_data: 'Weather' }],
          [{ text: 'Settings', callback_data: 'Settings' }],
        ],
      },
    };
  }

  if (type === 'settings') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Notification', callback_data: 'NotificationMenu' }],
          [{ text: ' « Back', callback_data: 'Back' }],
        ],
      },
    };
  }
}

module.exports = { getReplyMarkup };

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

  if (type === 'findBy') {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Знайти за геолокацією', callback_data: 'GetTrack' }],
          [{ text: 'Знайти за назвою', callback_data: 'GetData' }],
          [{ text: ' « Back', callback_data: 'Back' }],
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

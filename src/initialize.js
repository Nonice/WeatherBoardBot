function initializeBotCommands(telegram) {
  telegram.setMyCommands([
    {
      command: 'menu',
      description: 'Відкрити меню',
    },
    {
      command: 'location',
      description: 'Отримайте прогноз погоди за місцезнаходженням',
    },
    {
      command: 'city_name',
      description: 'Отримайте прогноз погоди за назвою міста',
    },
    {
      command: 'timezone',
      description: 'Встановіть власний часовий пояс',
    },
    {
      command: 'mystats',
      description: 'Показати інформацію про час',
    },
  ]);
}

module.exports = { initializeBotCommands };

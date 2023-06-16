function initializeBotCommands(telegram) {
  telegram.setMyCommands([
    {
      command: 'menu',
      description: 'menu',
    },
    {
      command: 'location',
      description: 'menu',
    },
    {
      command: 'city_name',
      description: 'menu',
    },
  ]);
}

module.exports = { initializeBotCommands };

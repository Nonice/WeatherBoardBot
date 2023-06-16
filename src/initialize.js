function initializeBotCommands(telegram) {
  telegram.setMyCommands([
    {
      command: 'menu',
      description: 'Open menu',
    },
    {
      command: 'location',
      description: 'Get weather by location',
    },
    {
      command: 'city_name',
      description: 'Get weather by city name',
    },
    {
      command: 'timezone',
      description: 'Set own timezone',
    },
    {
      command: 'mystats',
      description: 'Show my stats',
    },
  ]);
}

module.exports = { initializeBotCommands };
